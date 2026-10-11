import React, { useState, useMemo } from 'react';
import { FaSearch, FaFilter, FaCheckCircle, FaTimes, FaTrophy, FaStar, FaShieldAlt, FaCrosshairs, FaUserSecret, FaLock } from 'react-icons/fa';
import './ScenarioLobby.css';
import '../training/TrainingLobby.css';
import OperationZeroDayMeltdown from '../../data/scenarios/OperationZeroDayMeltdown';

// import { COURSE_CATALOG } from '../../data/CourseCatalog';
import { getAllModules } from '../../data/ModuleRegistry';

const ScenarioLobby = ({ scenarios, onSelect, userProgress }) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    const [hideCompleted, setHideCompleted] = useState(false);
    const [expandedCardId, setExpandedCardId] = useState(null);

    const allScenarios = useMemo(() => {
        // ... (Keep existing mocks or rely on passed scenarios)
        // For brevity, using passed scenarios + defaults if empty
        if (!scenarios || scenarios.length === 0) return [];
        return scenarios;
    }, [scenarios]);

    // === TAB STATE ===
    const [activeTab, setActiveTab] = useState('exams'); // 'exams' or 'sims'

    // Check locking status
    const isScenarioLocked = (scenario) => {
        if (scenario.type !== 'exam') return false;

        const modules = getAllModules();
        for (const course of modules) {
            const phaseIndex = course.phases.findIndex(p => p.scenarioId === scenario.id);
            if (phaseIndex !== -1) {
                if (phaseIndex === 0) return false;

                const prevPhase = course.phases[phaseIndex - 1];
                if (userProgress.completedScenarios) {
                    return !userProgress.completedScenarios.some(s =>
                        s.scenarioId === String(prevPhase.scenarioId || prevPhase.phaseId)
                    );
                }
                return true;
            }
        }
        return false;
    };

    // === FILTER LOGIC ===
    const visibleScenarios = useMemo(() => {
        // First filter by type (Tab)
        const typeFiltered = allScenarios.filter(s => {
            // Robust check: It's an exam if type is 'exam' OR title contains 'Exam'
            const isExam = s.type === 'exam' || s.title.toLowerCase().includes('exam');

            if (activeTab === 'exams') return isExam;
            return !isExam; // Sims
        });

        // Then apply search, difficulty, and hideCompleted
        return typeFiltered.filter(s => {
            const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.tagline.toLowerCase().includes(searchQuery.toLowerCase());
            // Case-insensitive check
            const matchesDiff = filterDifficulty === 'All' || (s.difficulty && s.difficulty.toLowerCase() === filterDifficulty.toLowerCase());
            const matchesCompletion = hideCompleted ? !s.completed : true;

            return matchesSearch && matchesDiff && matchesCompletion;
        });
    }, [allScenarios, activeTab, searchQuery, filterDifficulty, hideCompleted]);

    return (
        <div className="lobby-container scenario-lobby-container">
            {/* HEADER */}
            <div className="lobby-header-glass">
                <div className="header-content">
                    <h1 className="lobby-title">TACTICAL OPERATIONS</h1>
                    <div className="lobby-stats">
                        <span className="stat-line">
                            <FaCrosshairs className="stat-icon-small" /> CAMPAIGN PROGRESS: <span className="stat-highlight">{allScenarios.filter(s => s.completed).length} / {allScenarios.length}</span> COMPLETED
                        </span>
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="lobby-controls">

                {/* TABS - SEPARATE ROW ABOVE */}
                <div className="lobby-tabs-row">
                    <button
                        className={`lobby-tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
                        onClick={() => setActiveTab('exams')}
                    >
                        <FaCrosshairs /> TRAINING
                    </button>
                    <button
                        className={`lobby-tab-btn ${activeTab === 'sims' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sims')}
                    >
                        <FaShieldAlt /> TTX SIMULATION
                    </button>
                </div>

                {/* SEARCH & FILTERS - ROW BELOW */}
                <div className="lobby-controls-bar">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="SEARCH OPERATIONS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <button
                            className={`filter-btn ${hideCompleted ? 'active' : ''}`}
                            onClick={() => setHideCompleted(!hideCompleted)}
                            title="Hide Completed Missions"
                        >
                            {hideCompleted ? <FaCheckCircle /> : <FaCheckCircle style={{ opacity: 0.3 }} />}
                        </button>
                        <div className="filter-divider"></div>

                        {['All', 'Beginner', 'Intermediate', 'Hard', 'Insane'].map(diff => (
                            <button
                                key={diff}
                                className={`filter-btn ${filterDifficulty === diff ? 'active' : ''} ${diff.toLowerCase()}`}
                                onClick={() => setFilterDifficulty(diff)}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* SCENARIO GRID */}
            <div className="scenario-scroll-area">
                <div className="scenario-grid">
                    {visibleScenarios.length > 0 ? (
                        visibleScenarios.map(scenario => {
                            const locked = isScenarioLocked(scenario);
                            return (
                                <div
                                    key={scenario.id}
                                    className={`scenario-card ${expandedCardId === scenario.id ? 'expanded' : ''} ${scenario.completed ? 'completed' : ''} ${locked ? 'locked' : ''}`}
                                    onClick={() => {
                                        if (locked) return;
                                        onSelect(scenario);
                                    }}
                                >
                                    <div className="card-frame" style={{ backgroundImage: "url('/images/lobby-frame-bg.PNG')" }}></div>
                                    <div className="card-inner-content">
                                        <div className="card-thumbnail" style={{ backgroundImage: `url("${scenario.thumbnail}")` }}>
                                            {locked && <div className="scenario-lock-overlay"><FaLock className="lock-icon" /> Locked</div>}
                                            {/* NEW: Completion Badge (if not locked) */}
                                            {!locked && scenario.completed && (
                                                <div className="completion-badge">
                                                    <FaCheckCircle className="completion-icon" /> COMPLETED
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-info">
                                            <h3>{scenario.title}</h3>
                                            <p>{scenario.tagline}</p>
                                            <div className="card-details">
                                                <span className={`difficulty-${scenario.difficulty.toLowerCase()}`}>{scenario.difficulty}</span>
                                                <span>{scenario.time}</span>
                                                <span>{scenario.xp} XP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-results">
                            <h3>NO OPERATIONS FOUND</h3>
                            <p>Adjust your filters or search query.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScenarioLobby;