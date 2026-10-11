import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { FaUserSecret, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import './styles/AdminLayout.css'; // We'll reuse/extend this CSS

const AdminLock = ({ children }) => {
    const { user, isAuthenticated, loading } = useContext(AuthContext);
    const [accessStatus, setAccessStatus] = useState('checking'); // checking, granted, denied
    const [lockdownMessage, setLockdownMessage] = useState('');

    // HARDCODED WHITELIST FOR "10000% SECURITY"
    // Only these emails can even attempt to enter
    const ADMIN_WHITELIST = [
        'admin@cybergames.com',
        'ceo@cybergames.com',
        'norsayed307@gmail.com' // Verified Admin User
    ];

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated || !user) {
            setAccessStatus('denied');
            setLockdownMessage('AUTHENTICATION MISSING. TRACE INITIATED.');
            return;
        }

        // 1. Role Check
        if (!user.isAdmin) {
            setAccessStatus('denied');
            setLockdownMessage('INSUFFICIENT SECURITY CLEARANCE. ACCESS FLAGGED.');
            return;
        }

        // 2. Whitelist Check (The "10000%" Layer)
        if (!ADMIN_WHITELIST.includes(user.email)) {
            setAccessStatus('denied');
            setLockdownMessage('ACCOUNT NOT IN SUPREME COMMANDER LIST. BLACKLISTING IP.');
            return;
        }

        // If we get here, they are the chosen one
        setTimeout(() => setAccessStatus('granted'), 1000); // Fake scanning delay for drama
    }, [user, isAuthenticated, loading]);

    if (loading || accessStatus === 'checking') {
        return (
            <div className="admin-lock-screen scanning">
                <FaUserSecret className="pulse-icon" />
                <h2>RETINAL SCAN IN PROGRESS...</h2>
                <div className="scan-line"></div>
            </div>
        );
    }

    if (accessStatus === 'denied') {
        return (
            <div className="admin-lock-screen denied">
                <FaExclamationTriangle className="alert-icon" />
                <h1 className="glitch-text" data-text="SYSTEM LOCKDOWN">SYSTEM LOCKDOWN</h1>
                <p className="denied-msg">{lockdownMessage}</p>
                <div className="terminal-log">
                    <p>{'>'} DETECTED UNAUTHORIZED ENTRY ATTEMPT</p>
                    <p>{'>'} INTRUDER IDENTITY: [{user.email}]</p>
                    <p>{'>'} LOGGING IP ADDRESS... [192.168.X.X]</p>
                    <p>{'>'} DEPLOYING COUNTER-MEASURES...</p>
                    <p className="blink">{'>'} TERMINAL LOCKED.</p>
                </div>
                <button
                    className="btn-emergency-exit"
                    onClick={() => window.location.href = '/'}
                >
                    RETURN TO SAFETY
                </button>
            </div>
        );
    }

    return (
        <div className="admin-secure-wrapper">
            <div className="security-badge">
                <FaLock /> SECURE CONNECTION ESTABLISHED
            </div>
            {children}
        </div>
    );
};

export default AdminLock;
