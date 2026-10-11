import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa'; // Import new icon
import './GameplayInterface.css'; // Make sure this is imported

// Enhanced Evidence Modal (Clean Text View)
const EvidenceModal = ({ evidence, onClose }) => {
    if (!evidence) return null;

    return (
        <div className="gp-evidence-modal-overlay" onClick={onClose}>
            <div className="gp-evidence-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="gp-evidence-modal-close" onClick={onClose}><FaTimes /></button>
                <h3>{evidence.title || evidence.label || 'Evidence'}</h3>
                <div className="gp-evidence-body">
                    {/* Clean Monospace View without forced coloring */}
                    <div className="gp-code-editor-view">
                        <pre>{evidence.content || evidence.text}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};


const GameplayInterface = ({ currentNode, handleMakeChoice, onNextStep, isCardPlaying, playedCards, selectedRole, progress, totalTime, isJudgeVisible, judgeMessage, currentStep, totalSteps }) => {

    // === NEW STATE FOR THE MODAL ===
    const [evidenceModal, setEvidenceModal] = useState(null); // null or evidence object

    const openEvidence = (evidence) => {
        setEvidenceModal(evidence);
    };

    const closeEvidence = () => {
        setEvidenceModal(null);
    };

    // === SHUFFLE LOGIC ===
    const [shuffledOptions, setShuffledOptions] = useState([]);

    useEffect(() => {
        if (currentNode && currentNode.options) {
            // Fisher-Yates Shuffle
            const options = [...currentNode.options];
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }
            setShuffledOptions(options);
        } else {
            setShuffledOptions([]);
        }
    }, [currentNode]);

    // Format time mm:ss
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="scenario-gameplay-container">
            {/* ... Modal & Judge Overlay ... */}
            <EvidenceModal evidence={evidenceModal} onClose={closeEvidence} />
            {/* === JUDGE OVERLAY (Namespaced to avoid conflicts) === */}
            {isJudgeVisible && (
                <div className="gp-judge-overlay">
                    <div className="gp-judge-content">
                        <img src={selectedRole.avatar} alt="Role" className="gp-judge-avatar" />
                        <div className="gp-judge-text-box">
                            <h3>EVALUATION: COMPLETE</h3>
                            <p>{judgeMessage?.text || judgeMessage}</p>
                            <button className="gp-judge-continue-btn" onClick={onNextStep}>
                                PROCEED TO NEXT NODE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="versus-arena">
                {/* NEW APPLE ELEGANT HUD (Top Left) */}
                <div className="hud-glass-panel">
                    <div className="hud-metric-row">
                        <span className="hud-label-text">TIME ELAPSED</span>
                        <span className="hud-value-text">{formatTime(totalTime)}</span>
                    </div>

                    <div className="hud-divider"></div>

                    <div className="hud-metric-row">
                        <span className="hud-label-text">PROGRESS</span>
                        <div className="hud-progress-container">
                            <span className="hud-value-text">{currentStep} <span className="hud-total">/ {totalSteps}</span></span>
                        </div>
                    </div>
                </div>

                <div className="scenario-threat-zone">
                    <div className="scenario-threat-card">
                        <p className="scenario-threat-text" key={currentNode.text}>{currentNode.text}</p>
                    </div>

                    {/* Data Buttons Dock (Horizontal) */}
                    {currentNode.data && currentNode.data.length > 0 && (
                        <div className="threat-data-dock">
                            {currentNode.data.map((item, idx) => (
                                <button
                                    key={idx}
                                    className={`data-action-btn ${item.type}`}
                                    onClick={() => openEvidence(item)}
                                >
                                    <FaSearch className="icon" /> {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="scenario-response-zone">
                    <div className="scenario-player-hand">
                        {shuffledOptions.map((opt, index) => (
                            <div key={opt.text + index} className="scenario-response-card-wrapper" style={{ animationDelay: `${index * 0.2}s` }}>
                                <div
                                    className={`response-card ${isCardPlaying ? 'disabled' : ''}`}
                                    onClick={() => !isCardPlaying && handleMakeChoice(opt, index)} // Only allow click if not playing
                                >
                                    <div className="gp-response-text-content">
                                        {opt.text}
                                    </div>

                                    {/* === THIS IS THE NEW EVIDENCE BUTTON === */}
                                    {opt.evidence && (
                                        <button
                                            className="evidence-button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Stop click from triggering 'handleMakeChoice'
                                                openEvidence(opt.evidence);
                                            }}
                                        >
                                            <FaSearch /> Inspect Evidence
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameplayInterface;
