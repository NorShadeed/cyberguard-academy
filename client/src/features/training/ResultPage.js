import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaCertificate, FaTrophy } from 'react-icons/fa';
import './ResultPage.css';

const ResultPage = ({ results, module, onComplete, onExit, isSubmitting }) => {
    const isPhase3 = module.phaseId === 3;

    return (
        <div className={`training-result-page ${results.passed ? 'won' : 'lost'}`}>
            <div className="result-container">
                <div className="result-content">
                    {results.passed ? (
                        <>
                            <FaCheckCircle className="result-icon success" />
                            <h2>SIMULATION PASSED</h2>
                            {isPhase3 && (
                                <div className="result-info">
                                    <FaCheckCircle size={50} style={{ color: '#00ff88', marginBottom: '1rem' }} />
                                    <h3>COURSE COMPLETE</h3>
                                    <p>You have mastered the fundamentals.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <FaTimesCircle className="result-icon error" />
                            <h2>SIMULATION FAILED</h2>
                            <p className="fail-message">You need 60% to pass this module</p>
                        </>
                    )}

                    <div className="result-stats">
                        <div className="stat-card">
                            <span className="stat-label">Score</span>
                            <span className={`stat-value ${results.passed ? 'success' : 'error'}`}>
                                {results.percentage}%
                            </span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Points</span>
                            <span className="stat-value">{results.totalScore}/{results.maxScore}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Questions</span>
                            <span className="stat-value">{results.questionsAnswered}</span>
                        </div>
                    </div>

                    {results.passed && (
                        <div className="xp-reward">
                            <div className="xp-value">
                                <FaTrophy />
                                <span>+{results.xpEarned} XP</span>
                            </div>
                            {module.phaseId < 3 && <p className="unlock-message">Phase {module.phaseId + 1} Unlocked!</p>}
                        </div>
                    )}

                    <div className="result-actions">
                        {results.passed ? (
                            <button
                                className="btn-result success"
                                onClick={() => onComplete(results.totalScore, true)}
                                disabled={isSubmitting}
                            >
                                <span>{isSubmitting ? 'PROCESSING...' : 'CONTINUE'}</span>
                            </button>
                        ) : (
                            <button className="btn-result retry" onClick={onExit}>
                                <span>RETRY MODULE</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
