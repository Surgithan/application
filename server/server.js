const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const db = require('./database');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React frontend app
const path = require('path');
app.use(express.static(path.join(__dirname, '../dist')));

// Configure Nodemailer
let transporter;

const setupTransporter = async () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Use Real Gmail Account if credentials exist
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log('Real Email Service Configured:', process.env.EMAIL_USER);
    } else {
        // Fallback to Ethereal URL
        try {
            const account = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });
            console.log('Ethereal Email Configured (Dev Mode)');
            console.log('User:', account.user);
        } catch (err) {
            console.error('Failed to create Ethereal account:', err.message);
        }
    }
};

setupTransporter();

// Configure Twilio (Optional - only if credentials exist)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('Twilio SMS Service Configured');
} else {
    console.log('Twilio SMS not configured (optional feature)');
}

// API Endpoint to handle form submissions
app.post('/api/apply', (req, res) => {
    const { fullName, email, phone, position, experience, bio } = req.body;

    if (!fullName || !email || !phone || !position || !experience || !bio) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = `
    INSERT INTO applications (fullName, email, phone, position, experience, bio)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    db.run(query, [fullName, email, phone, position, experience, bio], async function (err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ error: 'Failed to save application.' });
        }

        const appId = this.lastID;
        let previewUrl = null;

        // Send Confirmation Email
        if (transporter) {
            const mailOptions = {
                from: '"Application Portal" <no-reply@example.com>',
                to: email,
                subject: 'Your request for received successfully',
                text: `Hello ${fullName},\n\nYour request for ${position} received successfully.\n\nThank you,\nRecruitment Team`,
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">Request Received Successfully</h2>
            <p>Hello <strong>${fullName}</strong>,</p>
            <p>Your request for <strong>${position}</strong> received successfully.</p>
            <p>We will review your details and get back to you shortly.</p>
            <br>
            <p>Thank you,</p>
            <p><strong>Recruitment Team</strong></p>
          </div>
        `,
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Confirmation email sent: ' + info.messageId);
                previewUrl = nodemailer.getTestMessageUrl(info);
                console.log('Preview URL: ' + previewUrl);
            } catch (error) {
                console.error('Error sending email:', error);
            }
        }

        // Send Confirmation SMS
        if (twilioClient) {
            try {
                const message = await twilioClient.messages.create({
                    body: `Hello ${fullName}! Your application for ${position} has been received successfully. We'll be in touch soon. - Recruitment Team`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: phone
                });
                console.log('Confirmation SMS sent: ' + message.sid);
            } catch (error) {
                console.error('Error sending SMS:', error.message);
            }
        }

        res.status(201).json({
            message: 'Application submitted successfully!',
            id: appId,
            previewUrl: previewUrl
        });
    });
});

// Endpoint to view applications (for testing)
app.get('/api/applications', (req, res) => {
    db.all('SELECT * FROM applications ORDER BY submittedAt DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
