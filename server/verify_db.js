const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'applications.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
});

db.all('SELECT * FROM applications', [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log('--- Database Content ---');
    if (rows.length === 0) {
        console.log('No applications found in the database.');
    } else {
        rows.forEach((row) => {
            console.log(JSON.stringify(row, null, 2));
        });
    }
    console.log('------------------------');
    db.close();
});
