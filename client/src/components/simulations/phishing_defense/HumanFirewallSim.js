import React, { useState, useEffect } from 'react';
import './HumanFirewallSim.css';
import {
    FaUserTie, FaHeadset, FaUniversity, FaPhone, FaShieldAlt,
    FaMicrophone, FaVolumeUp, FaWifi, FaBatteryFull, FaSignal, FaCheck, FaTimes
} from 'react-icons/fa';

const SCENARIOS = [
    {
        id: 1,
        caller: "John CEO",
        subtitle: "Mobile",
        avatar_initials: "JD",
        avatar_color: "#ef4444", // Red for suspicious vibes (subtle)
        transcript: "Hey, I'm at the airport and my corporate card got declined. I need you to wire $5,000 to this vendor account immediately or I'm going to miss my flight. Don't call me back, I'm boarding now.",
        correct_action: 'reject',
        explanation: "Threat: Urgency + 'Don't call me back' + Financial Request. This is a classic Deepfake Vishing attack.",
        type: 'deepfake'
    },
    {
        id: 2,
        caller: "IT Helpdesk",
        subtitle: "Internal • +1 (404) 555-0192",
        avatar_initials: "IT",
        avatar_color: "#3b82f6",
        transcript: "Hi, this is Mike from IT. We received a ticket #9921 regarding your printer connectivity. Can you confirm if the device is still showing an offline status on your end?",
        correct_action: 'trust',
        explanation: "This is a standard operational call. The caller is internal, references a specific ticket number, and isn't asking for sensitive credentials.",
        type: 'legit'
    },
    {
        id: 3,
        caller: "Chase Fraud",
        subtitle: "Toll Free Service",
        avatar_initials: "CH",
        avatar_color: "#10b981",
        transcript: "This is Chase Fraud Prevention. We detected unauthorized charges on your corporate account ending in 8821. We need you to verify your PIN to cancel these transactions immediately.",
        correct_action: 'verify',
        explanation: "Banks NEVER ask for your PIN over the phone. Even if the number looks real (spoofed), hang up and call the number on the back of your card.",
        type: 'vishing'
    }
];

const HumanFirewallSim = ({ onComplete }) => {
    // Game State
    const [level, setLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [callState, setCallState] = useState('incoming'); // incoming, active, feedback
    const [feedback, setFeedback] = useState(null);
    const [transcriptProgress, setTranscriptProgress] = useState("");
    const [callDuration, setCallDuration] = useState(0);

    const currentScenario = SCENARIOS[level];

    // Timer for active call
    useEffect(() => {
        let interval;
        if (callState === 'active') {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);

            // Simulate typing/speaking effect
            let i = 0;
            const text = currentScenario.transcript;
            const typeInterval = setInterval(() => {
                setTranscriptProgress(text.substring(0, i + 1));
                i++;
                if (i > text.length) clearInterval(typeInterval);
            }, 30); // Speed of speech

            return () => {
                clearInterval(interval);
                clearInterval(typeInterval);
            };
        } else {
            setCallDuration(0);
            setTranscriptProgress("");
        }
    }, [callState, currentScenario]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleAnswer = () => {
        setCallState('active');
    };

    const handleDecision = (decision) => {
        let isSuccess = false;

        // Logic:
        // Deepfake/Vishing -> Reject or Verify is GOOD. Trust is BAD.
        // Legit -> Trust is GOOD. Reject is BAD.

        const isThreat = currentScenario.type === 'deepfake' || currentScenario.type === 'vishing';

        if (isThreat) {
            if (decision === 'reject' || decision === 'verify') isSuccess = true;
        } else {
            if (decision === 'trust') isSuccess = true;
        }

        if (isSuccess) {
            setScore(prev => prev + 100);
            setFeedback({
                success: true,
                title: "THREAT NEUTRALIZED",
                message: currentScenario.explanation
            });
        } else {
            setFeedback({
                success: false,
                title: "SECURITY BREACH",
                message: "You made the wrong call. " + currentScenario.explanation
            });
        }
        setCallState('feedback');
    };

    const nextLevel = () => {
        if (level < SCENARIOS.length - 1) {
            setLevel(level + 1);
            setCallState('incoming');
            setFeedback(null);
        } else {
            onComplete && onComplete(score);
        }
    };

    return (
        <div className="human-firewall-container" style={{
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
            <div className="hf-phone-chassis">
                <div className="hf-screen">
                    {/* STATUS BAR */}
                    <div className="hf-status-bar">
                        <div className="hf-time">9:41</div>
                        <div className="hf-notch"></div>
                        <div className="hf-status-icons">
                            <FaSignal />
                            <FaWifi />
                            <FaBatteryFull />
                        </div>
                    </div>

                    {/* --- VIEW: INCOMING CALL --- */}
                    {callState === 'incoming' && (
                        <div className="hf-app-call">
                            <div className="call-header">
                                <div className="caller-avatar-large" style={{ background: currentScenario.avatar_color }}>
                                    {currentScenario.avatar_initials}
                                </div>
                                <div className="caller-name">{currentScenario.caller}</div>
                                <div className="caller-subtitle">{currentScenario.subtitle}</div>
                            </div>

                            <div className="call-actions-incoming">
                                <button className="action-btn" onClick={() => handleDecision('reject')}>
                                    <div className="btn-icon-circle icon-decline"><FaPhone style={{ transform: 'rotate(135deg)' }} /></div>
                                    <span className="action-label">Decline</span>
                                </button>
                                <button className="action-btn" onClick={handleAnswer}>
                                    <div className="btn-icon-circle icon-accept"><FaPhone /></div>
                                    <span className="action-label">Accept</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- VIEW: ACTIVE CALL --- */}
                    {callState === 'active' && (
                        <div className="hf-active-call">
                            <div className="active-call-header">
                                <div className="mini-avatar" style={{ background: currentScenario.avatar_color }}>
                                    {currentScenario.avatar_initials}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{currentScenario.caller}</div>
                                    <div className="call-timer">{formatTime(callDuration)}</div>
                                </div>
                            </div>

                            <div className="live-transcript-container">
                                <div className="transcript-meta">
                                    <div className="meta-pill">
                                        <FaMicrophone /> LIVE CAPTION
                                    </div>
                                    <div className="live-wave">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                                <div className="transcript-text">
                                    "{transcriptProgress}"
                                </div>
                            </div>

                            <div className="active-call-controls">
                                <button className="control-btn btn-secondary" onClick={() => handleDecision('verify')}>
                                    <FaShieldAlt /> VERIFY ID
                                </button>
                                <button className="control-btn btn-secondary" onClick={() => handleDecision('trust')}>
                                    <FaCheck /> APPROVE
                                </button>
                                <button className="control-btn btn-hero-danger" onClick={() => handleDecision('reject')}>
                                    <FaPhone style={{ transform: 'rotate(135deg)' }} /> END CALL
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- VIEW: FEEDBACK OVERLAY --- */}
                    {callState === 'feedback' && (
                        <div className="hf-feedback-overlay">
                            <div className={`feedback-badge ${feedback.success ? 'badge-success' : 'badge-fail'}`}>
                                {feedback.success ? 'PROTOCOL FOLLOWED' : 'PROTOCOL VIOLATION'}
                            </div>
                            <div className="feedback-title">{feedback.title}</div>
                            <div className="feedback-desc">{feedback.message}</div>

                            <button className="btn-next" onClick={nextLevel}>
                                {level < SCENARIOS.length - 1 ? 'Next Call' : 'Finish Simulation'}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default HumanFirewallSim;
