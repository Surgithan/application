import React, { useEffect, useState } from 'react';

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchApplications = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/applications');
            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }
            const data = await response.json();
            setApplications(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
        // Poll every 5 seconds to keep the list fresh
        const interval = setInterval(fetchApplications, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading && applications.length === 0) return <div className="loading-text">Loading applications...</div>;

    return (
        <div className="applications-container">
            <style>{`
        .applications-container {
          margin-top: 40px;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 30px;
          width: 100%;
          max-width: 800px;
          color: var(--text-primary);
        }

        .app-header {
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .app-list {
          display: grid;
          gap: 16px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .app-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 16px;
          transition: transform 0.2s;
        }

        .app-card:hover {
          transform: translateY(-2px);
          background: rgba(0, 0, 0, 0.3);
        }

        .app-name {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--primary-color);
        }

        .app-role {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .app-meta {
          display: flex;
          gap: 12px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          opacity: 0.8;
        }

        .loading-text {
          text-align: center;
          color: var(--text-secondary);
          margin-top: 20px;
        }
        
        .empty-state {
          text-align: center;
          padding: 20px;
          color: var(--text-secondary);
        }
      `}</style>

            <div className="app-header">
                <h3>Submitted Applications ({applications.length})</h3>
            </div>

            {error ? (
                <div style={{ color: '#ef4444', textAlign: 'center' }}>{error}</div>
            ) : (
                <div className="app-list">
                    {applications.length === 0 ? (
                        <div className="empty-state">No applications received yet.</div>
                    ) : (
                        applications.map((app) => (
                            <div key={app.id} className="app-card">
                                <div className="app-name">{app.fullName}</div>
                                <div className="app-role">{app.position} • {app.experience} Years Exp</div>
                                <div className="app-meta">
                                    <span>{app.email}</span>
                                    <span>•</span>
                                    <span>{new Date(app.submittedAt).toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ApplicationsList;
