import React, { useEffect } from 'react';
import './TrainingDetail.css';
import { FaChevronLeft, FaPlay, FaShieldAlt, FaTrophy, FaCheckCircle } from 'react-icons/fa';

const TrainingDetail = ({ module, onStart, onBack, isCompleted }) => {
    // FIX: Scroll to top when opening the page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div
            className="training-detail-container"
            style={{
                backgroundImage: "url('/images/bg-pixel-detail.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            <button onClick={onBack} className="detail-back-btn">
                <FaChevronLeft /> Back to Academy
            </button>

            <div className="detail-content-grid">
                <div className="detail-left-panel">
                    <img src="/images/phishing-pixel.png" alt={module.title} className="detail-image" />
                    <h1 className="detail-title">{module.title}</h1>
                    <p className="detail-tagline">"{module.description}"</p>
                    <div className="detail-metrics">
                        <span className="metric-item">
                            <FaShieldAlt /> Phase {module.phaseId}
                        </span>
                        <span className="metric-item">
                            <FaTrophy /> {module.xpReward} XP
                        </span>
                    </div>
                </div>

                <div className="detail-right-panel">
                    <h2>Module Briefing</h2>
                    <div className="detail-description" dangerouslySetInnerHTML={{ __html: module.content }} />

                    <h3>What You'll Learn</h3>
                    <ul className="learning-objectives">
                        <li>Corporate security policies and compliance</li>
                        <li>Ethical decision-making in cybersecurity</li>
                        <li>Risk assessment and mitigation strategies</li>
                    </ul>
                </div>
            </div>

            <button onClick={onStart} className={`detail-start-btn ${isCompleted ? 'review-mode' : ''}`}>
                {isCompleted ? <><FaCheckCircle /> Review Module</> : <><FaPlay /> Begin Training</>}
            </button>
        </div>
    );
};

export default TrainingDetail;
