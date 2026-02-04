import React, { useState } from 'react';

const Form = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        bio: '',
    });

    const [status, setStatus] = useState({ type: '', message: '', link: null });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('http://localhost:5000/api/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: 'Application submitted! Check your email.',
                    link: data.previewUrl
                });
                // Form data is kept to display in success message

            } else {
                setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to connect to the server.' });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStatus({ type: '', message: '', link: null });
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            position: '',
            experience: '',
            bio: '',
        });
    };

    if (status.type === 'success') {
        return (
            <div className="form-container" style={{ textAlign: 'center', padding: '60px 40px' }}>
                <style>{`
            .success-icon {
                width: 80px;
                height: 80px;
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
                animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            @keyframes scaleIn {
                from { transform: scale(0); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            .success-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #fff;
                margin-bottom: 12px;
            }

            .success-message {
                color: var(--text-secondary);
                margin-bottom: 32px;
                font-size: 1rem;
                line-height: 1.5;
            }

            .reset-btn {
                background: var(--glass-border);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 12px 24px;
                border-radius: 12px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .reset-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }
        `}</style>
                <div className="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h3 className="success-title">Success!</h3>
                <p className="success-message">
                    Your application has been submitted successfully.<br />
                    We have sent a confirmation email to <strong>{formData.email}</strong>.
                </p>
                {status.link && (
                    <div style={{ marginBottom: '16px' }}>
                        <a
                            href={status.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontWeight: 'bold' }}
                        >
                            View Email (Dev Mode)
                        </a>
                    </div>
                )}
                <button onClick={resetForm} className="reset-btn">
                    Open Form Again
                </button>
            </div>
        );
    }

    return (
        <div className="form-container">
            <style>{`
        .form-container {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 40px;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .form-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .form-header h2 {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .form-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .status-message {
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 24px;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .status-success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color 0.3s ease;
        }

        .form-input {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text-primary);
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
          background: rgba(0, 0, 0, 0.3);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        select.form-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
        }

        .submit-btn {
          width: 100%;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 12px;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .grid-2 { grid-template-columns: 1fr; }
          .form-container { padding: 24px; }
        }
      `}</style>

            <div className="form-header">
                <h2>Join Our Team</h2>
                <p>Complete the form below to apply for your dream role</p>
            </div>

            {status.message && status.type === 'error' && (
                <div className={`status-message status-${status.type}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        className="form-input"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="grid-2">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-input"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="grid-2">
                    <div className="form-group">
                        <label className="form-label">Position</label>
                        <select
                            name="position"
                            className="form-input"
                            value={formData.position}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="" disabled>Select Position</option>
                            <option value="frontend">Frontend Developer</option>
                            <option value="backend">Backend Developer</option>
                            <option value="designer">UI/UX Designer</option>
                            <option value="pm">Project Manager</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Experience (Years)</label>
                        <input
                            type="number"
                            name="experience"
                            className="form-input"
                            placeholder="e.g. 3"
                            value={formData.experience}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Tell us about yourself</label>
                    <textarea
                        name="bio"
                        className="form-input"
                        rows="4"
                        placeholder="Share your experience and why you're a great fit..."
                        value={formData.bio}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? <div className="spinner"></div> : 'Submit Application'}
                </button>
            </form>
        </div>
    );
};

export default Form;
