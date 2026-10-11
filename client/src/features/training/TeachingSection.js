import React, { useState } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { TEACHING_MODULES } from '../../data/TeachingContent';
import './ModuleTeaching.css'; // RESTORED: User requested old css
import './styles/CyberAwareness.css'; // NEW: Insane module styles
import './styles/CyberAwarenessPremium.css'; // PREMIUM: Apple-inspired elegant enhancements

const TeachingSection = ({ moduleId, onComplete, lessons: propLessons, professor: propProfessor }) => {
    const [step, setStep] = useState(0);

    // Prefer props (Dynamic Module) -> Fallback to Static Lookup -> Fallback to Default
    const moduleData = TEACHING_MODULES[moduleId] || TEACHING_MODULES['p1_phishing_detect'];
    const professor = propProfessor || moduleData.professor;
    const lessons = propLessons || moduleData.lessons;

    const handleNext = () => {
        if (step < lessons.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const containerRef = React.useRef(null);

    React.useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo(0, 0);
        }
    }, [step]);

    const currentLesson = lessons[step];

    return (
        <div className="teaching-section-overlay">
            {/* Professor Header */}
            <div className="professor-header">
                <div className="prof-avatar">
                    {professor.avatarIcon}
                </div>
                <div className="prof-info">
                    <h2>{professor.name}</h2>
                    <p>{professor.title}</p>
                </div>

                {/* Sidebar Flavor Details */}
                <div className="sidebar-stats">
                    <div className="stat-row">
                        <span className="label">UPLINK</span>
                        <span className="value active">SECURE</span>
                    </div>
                    <div className="stat-row">
                        <span className="label">CLEARANCE</span>
                        <span className="value classified">TOP SECRET</span>
                    </div>
                    <div className="stat-row">
                        <span className="label">SESSION ID</span>
                        <span className="value">X7-992-B</span>
                    </div>
                    <div className="stat-row">
                        <span className="label">STATUS</span>
                        <span className="value active">ONLINE</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="teaching-content-body" ref={containerRef}>
                <div className="lesson-slide" key={currentLesson.id}>
                    <h1 className="lesson-title">{currentLesson.title}</h1>
                    <div className="lesson-text">
                        {currentLesson.content}

                        {/* Footer Navigation - Inside Lesson Text for Perfect Alignment */}
                        <div className="teaching-footer">
                            <button
                                className="control-btn"
                                onClick={handlePrev}
                                disabled={step === 0}
                                style={{ opacity: step === 0 ? 0.3 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer' }}
                            >
                                <FaArrowLeft /> PREV
                            </button>

                            <div className="progress-dots">
                                {lessons.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`dot ${idx === step ? 'active' : ''}`}
                                    />
                                ))}
                            </div>

                            <button
                                className={`control-btn ${step === lessons.length - 1 ? 'complete' : 'next'}`}
                                onClick={handleNext}
                            >
                                {step === lessons.length - 1 ? "START SIMULATION" : "NEXT"} <FaArrowRight style={{ marginLeft: 8 }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default TeachingSection;
export { TeachingSection };
