import React, { useState, useEffect } from 'react';
import { FaTimes, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaUsers, FaClock, FaSearch } from 'react-icons/fa';
import './CareerPath.css';
import './CourseRunner.css';
import { TeachingSection } from './TeachingSection';
import { getSimulationComponent } from '../../components/simulations/SimulationRegistry';

const CourseRunner = ({ course, phase, onClose, onComplete, onNextPhase, hasNextPhase, saveProgress }) => {
    const [viewState, setViewState] = useState('teaching'); // 'teaching' | 'activity' | 'complete' | 'fail'

    // --- RENDER HELPERS ---
    const [isNavigating, setIsNavigating] = useState(false);

    const handleReturnToCatalog = () => {
        if (isNavigating) return;
        setIsNavigating(true);
        if (onComplete) onComplete();
    };

    // Generic completion handler passed to simulations
    const handleSimulationComplete = (success, score) => {
        if (success) {
            if (saveProgress) saveProgress();
            setViewState('complete');
        } else {
            setViewState('fail');
        }
    };

    const renderSuccessModal = () => (
        <div className="cr-success-modal">
            <FaCheckCircle className="success-icon" />
            <h2>MISSION ACCOMPLISHED</h2>
            <p>Threat neutralized. You successfully identified the attack vector.</p>
            <div className="cr-modal-actions">
                <button className="cr-next-btn secondary" onClick={handleReturnToCatalog} disabled={isNavigating}>
                    RETURN TO CATALOG
                </button>
            </div>
        </div>
    );

    const renderFailModal = () => (
        <div className="cr-success-modal" style={{ borderColor: '#ff4757', boxShadow: '0 0 100px rgba(255, 71, 87, 0.4)' }}>
            <FaExclamationTriangle className="success-icon" style={{ color: '#ff4757', filter: 'drop-shadow(0 0 20px rgba(255, 71, 87, 0.6))' }} />
            <h2 style={{ color: '#ff4757' }}>ANALYSIS FAILED</h2>
            <p>You missed critical indicators in the transcript or analysis.</p>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                    className="cr-next-btn primary"
                    onClick={() => setViewState('activity')}
                    style={{
                        background: 'linear-gradient(135deg, #ff4757 0%, #c0392b 100%)',
                        boxShadow: '0 10px 30px rgba(255, 71, 87, 0.4)',
                        minWidth: '200px'
                    }}
                >
                    RETRY MISSION
                </button>
            </div>
        </div>
    );

    return (
        <div className="course-runner-overlay">
            {/* HEADER REMOVED AS REQUESTED */}

            <div className="runner-body">
                {viewState === 'teaching' && (
                    <TeachingSection
                        moduleId={phase.phaseId}
                        onComplete={() => setViewState('activity')}
                        lessons={phase.lessons}
                        professor={phase.professor}
                    />
                )}

                {viewState === 'activity' && (
                    <>
                        {/* Dynamic Registry Loading */}
                        {(() => {
                            const SimComponent = getSimulationComponent(phase.phaseId);
                            if (SimComponent) {
                                return (
                                    <SimComponent
                                        phase={phase}
                                        onComplete={handleSimulationComplete} />
                                );
                            }
                            return <div style={{ padding: 50, color: 'white' }}>Simulation module not found: {phase.phaseId}</div>;
                        })()}
                    </>
                )}

                {/* Generic Success Screen */}
                {viewState === 'complete' && renderSuccessModal()}
                {viewState === 'fail' && renderFailModal()}
            </div>
        </div>
    );
};

export default CourseRunner;
