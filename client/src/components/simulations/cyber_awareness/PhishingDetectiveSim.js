import React, { useState, useRef } from 'react';
import { FaShieldAlt, FaExclamationTriangle, FaSearch, FaArrowLeft, FaTrash, FaCheckCircle, FaTimes, FaEnvelopeOpenText } from 'react-icons/fa';
import './CyberAwarenessSim.css';
import '../../../features/training/CareerPath.css'; // Keep core styles for now until further cleanup

const PhishingDetectiveSim = ({ onComplete, phase }) => {
    // --- STATE ---
    const [emails, setEmails] = useState([
        {
            id: 1,
            subject: "Quarterly All-Hands Meeting",
            senderName: "Sarah Jenkins (CEO)",
            senderEmail: "s.jenkins@cyber-fictional.com",
            body: "Team, please join us for the Q3 review this Friday at 2 PM. We have some exciting updates regarding the new security initiatives.",
            linkText: "Add to Calendar",
            linkUrl: "http://intranet.cyber-fictional.com/calendar/event/882",
            flags: [],
            foundFlags: [],
            isPhishing: false,
            date: "10:15 AM"
        },
        {
            id: 2,
            subject: "URGENT: Password Expiry Notification",
            senderName: "IT Support Team",
            senderEmail: "support@micros0ft-security.com", // Typo-squat
            body: "Your corporate account password will expire in 2 hours. Please click the link below to strict reset it immediately to avoid lockout.",
            linkText: "Reset Password Now",
            linkUrl: "http://bit.ly/secure-login-22", // Suspicious link
            flags: ['sender_domain', 'urgency', 'suspicious_link'],
            foundFlags: [],
            wrongFlags: [],
            isPhishing: true,
            date: "9:42 AM"
        },
        {
            id: 3,
            subject: "Lunch Menu - Cafeteria",
            senderName: "Facilities",
            senderEmail: "facilities@cyber-fictional.com",
            body: "Today's specials: Grilled Salmon, Vegan Curry, and custom Tacos. Don't forget it's Taco Tuesday!",
            linkText: "View Full Menu",
            linkUrl: "http://intranet.cyber-fictional.com/menu",
            flags: [],
            foundFlags: [],
            isPhishing: false,
            date: "9:15 AM"
        },
        {
            id: 4,
            subject: "Project Falcon - Specs Updated",
            senderName: "Devin Ross",
            senderEmail: "d.ross@cyber-fictional.com",
            body: "Hey, I pushed the new specs for Project Falcon to the repo. Let me know if you catch any edge cases.",
            linkText: "View Repository",
            linkUrl: "http://git.cyber-fictional.internal/falcon/specs",
            flags: [],
            foundFlags: [],
            isPhishing: false,
            date: "Yesterday"
        },
        {
            id: 5,
            subject: "Welcome to the team!",
            senderName: "HR Dept",
            senderEmail: "hr@cyber-fictional.com",
            body: "Just a reminder to complete your onboarding checklist by end of week. We are glad to have you here!",
            linkText: "Onboarding Portal",
            linkUrl: "http://hr.cyber-fictional.internal/onboarding",
            flags: [],
            foundFlags: [],
            isPhishing: false,
            date: "Yesterday"
        }
    ]);
    const [currentEmailIndex, setCurrentEmailIndex] = useState(0);

    // --- UI STATE ---
    const [notification, setNotification] = useState({ message: '', type: '', visible: false }); // type: 'success' | 'error' | 'info'
    const [isWidgetCollapsed, setIsWidgetCollapsed] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);
    const [hintUsed, setHintUsed] = useState(false);

    const notificationTimer = useRef(null);

    // --- HELPER: NOTIFICATIONS ---
    const showNotification = (message, type = 'info', duration = 3500) => {
        if (notificationTimer.current) clearTimeout(notificationTimer.current);

        setNotification({ message, type, visible: true });

        notificationTimer.current = setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, duration);
    };

    const handleHint = () => {
        if (hintUsed) {
            showNotification("REMINDER: Check the sender address for 'typo-squatting' (e.g. micros0ft.com).", 'info');
            return;
        }
        setHintUsed(true);
        showNotification("HINT: Attackers often use 'typo-squatting' in domains. Check the sender address carefully.", 'info');
    };

    // NEW: Handle "Report Phishing" Button
    const handleReportPhishing = () => {
        const currentEmail = emails[currentEmailIndex];
        if (currentEmail.isPhishing) {
            // WIN CONDITION
            showNotification("THREAT ELIMINATED. Good work, detective.", 'success');
            setTimeout(() => onComplete(true, 100), 1500);
        } else {
            // LOSS/WARN CONDITION
            if (currentEmail.senderEmail.includes('cyber-fictional.com')) {
                showNotification("FALSE POSITIVE: Internal domain verified. This email is safe.", 'error');
            } else {
                showNotification("FALSE POSITIVE: No threats detected in this email. Keep looking.", 'error');
            }
        }
    };

    const handleFlagClick = (flagType) => {
        const currentEmail = emails[currentEmailIndex];

        if (!currentEmail.isPhishing) {
            showNotification("SAFE ELEMENT: This content checks out. No threat here.", 'info');
            return;
        }

        // Prevent double clicking
        if (currentEmail.foundFlags.includes(flagType) || (currentEmail.wrongFlags && currentEmail.wrongFlags.includes(flagType))) return;

        const updatedEmails = [...emails];

        if (currentEmail.flags.includes(flagType)) {
            // Correct Flag Found
            updatedEmails[currentEmailIndex].foundFlags.push(flagType);
            setEmails(updatedEmails);
            showNotification("Threat Flagged: " + flagType.replace('_', ' ').toUpperCase(), 'success');
        } else {
            // Incorrect Guess (False Positive)
            if (!updatedEmails[currentEmailIndex].wrongFlags) updatedEmails[currentEmailIndex].wrongFlags = [];
            updatedEmails[currentEmailIndex].wrongFlags.push(flagType);
            setEmails(updatedEmails);

            // Specific feedback
            if (flagType === 'timestamp') showNotification("Timestamp Verified: Sending time is normal.", 'info');
            else if (flagType === 'subject') showNotification("Subject Line Clean: No alarmist keywords.", 'info');
            else if (flagType === 'footer') showNotification("Footer Verified: Standard corporate disclaimer.", 'info');
            else showNotification("Analysis Result: No threat detected here.", 'info');
        }
    };

    const email = emails[currentEmailIndex];
    const isWrong = (type) => email.wrongFlags && email.wrongFlags.includes(type);

    return (
        <div className="cr-simulation-desktop" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 50,
            overflowY: 'auto',
            paddingTop: '60px',
            background: 'var(--simulation-bg)',
            backgroundRepeat: 'repeat',
            backgroundSize: '512px 512px',
            backgroundAttachment: 'fixed',
        }}>

            {/* NOTIFICATION TOAST */}
            <div className={`cr-notification-toast ${notification.visible ? 'visible' : ''} ${notification.type}`}>
                {notification.type === 'success' && <FaCheckCircle />}
                {notification.type === 'error' && <FaTimes />}
                {notification.type === 'info' && <FaShieldAlt />}
                <span>{notification.message}</span>
            </div>

            {/* Mission Widget (Fixed HUD) */}
            <div className={`cr-mission-widget ${isWidgetCollapsed ? 'collapsed' : ''}`} onClick={() => setIsWidgetCollapsed(!isWidgetCollapsed)}>
                <div className="widget-header">
                    <h3><FaShieldAlt /> {isWidgetCollapsed ? '' : 'INBOX DEFENDER'}</h3>
                    <div className="widget-toggle">{isWidgetCollapsed ? '+' : '−'}</div>
                </div>

                {!isWidgetCollapsed && (
                    <div className="cr-mission-status">
                        <div style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: 5 }}>
                            MISSION: Find and report the <strong style={{ color: '#ff0055' }}>1 Phishing Email</strong>.
                        </div>
                    </div>
                )}
            </div>

            {/* Hint Widget (Fixed HUD) */}
            <div className={`cr-hint-widget ${isWidgetCollapsed ? 'moved-up' : ''}`}>
                <button
                    className={`cr-hint-btn-fixed ${hintUsed ? 'used' : ''}`}
                    onClick={handleHint}
                >
                    <FaSearch /> {hintUsed ? 'Read Hint Again' : 'Need a Clue?'}
                </button>
            </div>

            {/* Cyber Email Client Window */}
            <div className="cr-email-window">
                <div className="cr-window-header">
                    <div className="window-dots">
                        <div className="w-dot red"></div>
                        <div className="w-dot yellow"></div>
                        <div className="w-dot green"></div>
                    </div>
                    <div className="window-title">SecureMail v4.0 - Corporate Inbox</div>
                </div>

                <div className="cr-client-body">
                    {/* LEFT PANE: EMAIL LIST */}
                    <div className="cr-email-list-pane">
                        <div className="cr-pane-header">INBOX ({emails.length})</div>
                        {emails.map((e, idx) => (
                            <div
                                key={e.id}
                                className={`cr-email-list-item ${currentEmailIndex === idx ? 'active' : ''}`}
                                onClick={() => setCurrentEmailIndex(idx)}
                            >
                                <div className="list-sender">{e.senderName}</div>
                                <div className="list-subject">{e.subject}</div>
                                <div className="list-date">{e.date}</div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT PANE: READING PANE */}
                    <div className="cr-email-content-area">
                        {/* Toolbar */}
                        <div className="cr-email-toolbar">
                            <div style={{ display: 'flex', gap: 10 }}>
                                <FaArrowLeft style={{ opacity: 0.5 }} />
                                <FaTrash style={{ opacity: 0.5 }} />
                            </div>
                            <div style={{ marginLeft: 'auto' }}>
                                <button className="cr-report-btn" onClick={handleReportPhishing}>
                                    <FaExclamationTriangle /> REPORT PHISHING
                                </button>
                            </div>
                        </div>

                        {/* Email View */}
                        <div className="cr-email-view">
                            <div
                                className={`cr-email-subject ${isWrong('subject') ? 'wrong-shake' : ''} ${email.foundFlags.includes('urgency') ? 'flagged-highlight' : ''}`}
                                onClick={() => handleFlagClick('subject')}
                                style={{ cursor: 'crosshair' }}
                            >
                                {email.subject}
                                {email.foundFlags.includes('urgency') && <span className="flag-badge-inline">URGENCY TRIGGER</span>}
                            </div>
                            <div className="cr-email-meta">
                                <div className="sender-avatar">{email.senderName.charAt(0)}</div>
                                <div className="sender-info">
                                    <div
                                        className={`sender-name ${isWrong('sender') ? 'wrong-shake' : ''} ${email.foundFlags.includes('sender_domain') ? 'flagged-highlight' : ''}`}
                                        onClick={() => handleFlagClick('sender_domain')}
                                        style={{ cursor: 'crosshair' }}
                                    >
                                        {email.senderName} <span style={{ fontWeight: 'normal', color: '#888' }}>&lt;{email.senderEmail}&gt;</span>
                                        {email.foundFlags.includes('sender_domain') && <span className="flag-badge-inline">SPOOFED DOMAIN</span>}
                                    </div>
                                    <div className="sender-recip">To: Me &lt;me@cyber-fictional.com&gt;</div>
                                </div>
                                <div
                                    style={{ marginLeft: 'auto', color: '#666', fontSize: '0.9rem', cursor: 'crosshair' }}
                                    onClick={() => handleFlagClick('timestamp')}
                                >
                                    {email.date}
                                </div>
                            </div>

                            <div className="cr-email-body-text">
                                {/* Body Text Rendering */}
                                {email.body.split('\n').map((line, i) => (
                                    <p key={i} style={{ marginBottom: 10 }}>
                                        {line}
                                    </p>
                                ))}

                                {/* Action Button/Link if it exists */}
                                <div style={{ marginTop: 30 }}>
                                    <button
                                        style={{
                                            background: email.id === 1 ? '#0078d4' : '#0a66c2', // Slight variance
                                            color: 'white',
                                            border: email.foundFlags.includes('suspicious_link') ? '2px solid #ff0055' : 'none',
                                            padding: '10px 20px',
                                            borderRadius: 4,
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={() => setHoveredLink(email.linkUrl)}
                                        onMouseLeave={() => setHoveredLink(null)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFlagClick('suspicious_link');
                                        }}
                                    >
                                        {email.linkText}
                                        {email.foundFlags.includes('suspicious_link') && (
                                            <div style={{ position: 'absolute', top: -10, right: -10, background: '#ff0055', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4 }}>
                                                MALICIOUS LINK
                                            </div>
                                        )}
                                    </button>
                                </div>

                                <p
                                    style={{ marginTop: 40, color: '#666', fontSize: '0.85rem', borderTop: '1px solid #333', paddingTop: 20, cursor: 'crosshair' }}
                                    onClick={() => handleFlagClick('footer')}
                                >
                                    Use of this service is governed by the Corporate IT Policy. <br />
                                    &copy; 2077 Cyber-Fictional Corp.
                                </p>
                            </div>
                        </div>

                        {/* BROWSER STATUS BAR (URL PREVIEW) */}
                        {hoveredLink && (
                            <div className="cr-browser-status-bar">
                                <span style={{ color: '#888', marginRight: 5 }}>Target:</span>
                                <span style={{ fontFamily: 'monospace', color: '#fff' }}>{hoveredLink}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhishingDetectiveSim;
