import React, { useState, useEffect, useMemo, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './TrainingLobby.css';
import {
    FaCheckCircle, FaLock, FaCertificate, FaShieldAlt,
    FaStar, FaClock, FaSignal, FaChartLine, FaUsers, FaBriefcase,
    FaAward, FaTrophy, FaLightbulb, FaRocket, FaPlay,
    FaExpand, FaCompress, FaFilter, FaSearch, FaTimes, FaMapMarkedAlt, FaList, FaMedal
} from 'react-icons/fa';

import { CAREER_PATHS } from '../../data/CareerPaths';
// import { COURSE_CATALOG } from '../../data/CourseCatalog'; // OLD STATIC LINK
import { getAllModules } from '../../data/ModuleRegistry'; // NEW DYNAMIC LINK
import CareerPathView from './CareerPathView';
import { AuthContext } from '../../features/auth/AuthContext';

// Use the registry to populate the catalog
const COURSE_CATALOG = getAllModules();
// CourseRunner import no longer needed in Lobby, but keeping referencing clean

/**
 * MAIN TRAINING LOBBY COMPONENT
 */
const TrainingLobby = ({ modules = [], onSelectModule, userProgress = {}, isPhaseUnlocked }) => {
    const navigate = useNavigate();
    const { gamification } = useContext(AuthContext);

    const [viewMode, setViewMode] = useState('catalog'); // 'academy' | 'catalog'
    const [activePathId, setActivePathId] = useState(CAREER_PATHS[0].id); // Default to SOC Analyst

    const [expandedCourse, setExpandedCourse] = useState(null); // No auto-expand
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // ... (keep existing stats/effects) ...
    // Initialize from localStorage
    const [hideCompleted] = useState(() => {
        const saved = localStorage.getItem('training_hide_completed');
        return saved === 'true';
    });

    const [showFilters, setShowFilters] = useState(false);
    // ...

    // Get current active path data
    const activePath = CAREER_PATHS.find(p => p.id === activePathId) || CAREER_PATHS[0];

    // Handle Launch from Map
    const handleLaunchModule = (node) => {
        console.log("Launching node:", node);

        if (node.type === 'course' && node.catalogId) {
            // Switch to Catalog View and Open the Course
            setViewMode('catalog');
            setExpandedCourse(node.catalogId);
            // Optional: Filter to show only this one or scroll to it
        } else if (node.type === 'scenario') {
            navigate('/scenarios');
        } else if (node.type === 'module') {
            // For now, assume a generic module viewer or alert
            // In real app: navigate(`/training/modules/${node.id}`);
            // FIXED: Navigate to CourseRunner
            navigate(`/training/run/${node.id}`);
        } else {
            alert(`[DEMO] Launching Activity: ${node.title}`);
        }
    };

    // Persist Hide Completed setting
    useEffect(() => {
        localStorage.setItem('training_hide_completed', hideCompleted);
    }, [hideCompleted]);

    // Calculate overall statistics
    const overallStats = useMemo(() => {
        let totalPhases = 0;
        let completedPhases = 0;
        let totalXP = 0;
        let earnedCerts = 0;

        // 1. Calculate Course/Phase Stats
        COURSE_CATALOG.forEach(course => {
            totalPhases += course.phases.length;
            course.phases.forEach(phase => {
                if (userProgress[`phase${phase.phaseId}`]) {
                    completedPhases++;
                    totalXP += phase.xpReward;
                }
            });
        });

        // 2. Calculate Earned Certificates (Career Path Level)
        // A certificate is earned ONLY if ALL courses in a Career Path are 100% complete.
        CAREER_PATHS.forEach(path => {
            if (!path.nodes) return;

            // Get all course IDs in this path
            const pathCourseIds = path.nodes
                .filter(node => node.type === 'course')
                .map(node => node.catalogId);

            if (pathCourseIds.length === 0) return;

            // Check if every course in this path is fully completed
            const isPathComplete = pathCourseIds.every(courseId => {
                const course = COURSE_CATALOG.find(c => c.id === courseId);
                if (!course) return false; // Should not happen if data is consistent

                // Check if all phases of the course are complete
                return course.phases.every(p => {
                    // Use the same completion logic as CourseCard
                    const isLegacyId = ['1', '2', '3'].includes(String(p.phaseId));
                    if (!isLegacyId) {
                        return userProgress.completedScenarios?.some(s =>
                            s.scenarioId === String(p.phaseId) || (p.scenarioId && s.scenarioId === String(p.scenarioId))
                        );
                    }
                    if (course.id === 'security-awareness') {
                        return userProgress[`phase${p.phaseNumber}`];
                    }
                    return userProgress[`phase${p.phaseNumber}`];
                });
            });

            if (isPathComplete) {
                earnedCerts++;
            }
        });

        return {
            totalPhases,
            completedPhases,
            totalXP: gamification?.xp || totalXP, // Use Gamification Context XP if available
            earnedCerts,
            totalCourses: COURSE_CATALOG.length,
            completionRate: totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0
        };
    }, [userProgress, gamification]);

    // Filter courses
    const filteredCourses = useMemo(() => {
        let result = [...COURSE_CATALOG];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(course =>
                course.title.toLowerCase().includes(query) ||
                course.description.toLowerCase().includes(query) ||
                course.category.toLowerCase().includes(query) ||
                course.phases.some(p => p.title.toLowerCase().includes(query))
            );
        }

        if (selectedCategory !== 'All') {
            if (selectedCategory === 'Completed') {
                result = result.filter(course =>
                    course.phases.every(p => userProgress[`phase${p.phaseId}`])
                );
            } else if (selectedCategory === 'In Progress') {
                result = result.filter(course => {
                    const hasStarted = course.phases.some(p => userProgress[`phase${p.phaseId}`]);
                    const isComplete = course.phases.every(p => userProgress[`phase${p.phaseId}`]);
                    return hasStarted && !isComplete;
                });
            } else {
                result = result.filter(course => course.category === selectedCategory);
            }
        }

        // Hide Completed Filter
        if (hideCompleted) {
            result = result.filter(course => {
                const completed = course.phases.filter(p => userProgress[`phase${p.phaseId}`]).length;
                return completed < course.phases.length;
            });
        }

        return result;
    }, [searchQuery, selectedCategory, hideCompleted, userProgress]); // Added hideCompleted to dependency

    // Categories for filter
    const categories = ['All', 'In Progress', 'Completed', ...new Set(COURSE_CATALOG.map(c => c.category))];

    const handlePhaseSelect = (course, phase) => {
        console.log("handlePhaseSelect Triggered:", phase.title);
        if (phase.type === 'scenario') {
            console.log("Navigating to Scenario:", phase.scenarioId);
            // Navigate to Scenario Page with the target Scenario ID to auto-load it
            navigate('/scenarios', { state: { autoLaunchId: phase.scenarioId } });
        } else {
            console.log("Navigating to Learning Module:", phase.phaseId);
            // Navigate to dedicated Course Runner Page
            navigate(`/training/run/${phase.phaseId}`);
        }
    };

    return (
        <div className="training-lobby">
            {/* Background */}
            <div className="lobby-bg-grid"></div>


            {/* Overlay Removed - Routed instead */}

            {/* Header */}
            <header className="lobby-header">

                <div className="container">
                    <div className="header-branding">
                        <div className="brand-text">
                            <h1 className="brand-title">Cyber Academy</h1>
                            <p className="brand-subtitle">Blue Team Career Progression & Certification</p>
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="stats-dashboard">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ color: '#00d4ff' }}><FaShieldAlt /></div>
                            <div className="stat-content">
                                <div className="stat-value">{gamification?.rank || 'Cadet'}</div>
                                <div className="stat-label">Current Rank</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ color: '#ffd60a' }}><FaTrophy /></div>
                            <div className="stat-content">
                                <div className="stat-value">{overallStats.totalXP.toLocaleString()}</div>
                                <div className="stat-label">Total XP</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ color: '#00ff88' }}><FaAward /></div>
                            <div className="stat-content">
                                <div className="stat-value">{gamification?.streak || 0}</div>
                                <div className="stat-label">Day Streak</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ color: '#ff0055' }}><FaChartLine /></div>
                            <div className="stat-content">
                                <div className="stat-value">{gamification?.level || 1}</div>
                                <div className="stat-label">Level</div>
                            </div>
                        </div>
                    </div>

                    {/* Controls & Toggle */}
                    <div className="search-controls" style={{ justifyContent: 'space-between', maxWidth: '100%' }}>
                        <div className="view-toggle" style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                            <button
                                className={`filter-toggle ${viewMode === 'catalog' ? 'active' : ''}`}
                                onClick={() => setViewMode('catalog')}
                            >
                                <FaList /> Course Catalog
                            </button>
                            <button
                                className={`filter-toggle ${viewMode === 'academy' ? 'active' : ''}`}
                                onClick={() => setViewMode('academy')}
                            >
                                <FaMapMarkedAlt /> Career Path
                            </button>
                        </div>

                        {viewMode === 'catalog' && (
                            <div style={{ display: 'flex', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
                                <div className="search-bar" style={{ maxWidth: 400 }}>
                                    <FaSearch className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button className="clear-btn" onClick={() => setSearchQuery('')}>
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                                <button
                                    className={`filter-toggle ${showFilters ? 'active' : ''}`}
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <FaFilter /> Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Categories (Only for Catalog) */}
                    <AnimatePresence>
                        {showFilters && viewMode === 'catalog' && (
                            <motion.div
                                className="category-filters"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <div className="lobby-main container">

                {/* Section Header */}
                <div className="section-header-container">
                    <h2 className="section-title">
                        {viewMode === 'academy' ? '> SELECT CAREER TRACK' : '> AVAILABLE MODULES'}
                    </h2>
                    <div className="section-line"></div>
                </div>

                {viewMode === 'academy' ? (
                    <div className="academy-view">
                        {/* PATH SELECTOR */}
                        <div className="path-selector-bar" style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
                            {CAREER_PATHS.map(path => (
                                <button
                                    key={path.id}
                                    className={`path-select-btn ${activePathId === path.id ? 'active' : ''}`}
                                    onClick={() => setActivePathId(path.id)}
                                    style={{
                                        background: activePathId === path.id
                                            ? `linear-gradient(135deg, ${path.color}dd, ${path.color}66)`
                                            : 'rgba(255, 255, 255, 0.03)',
                                        border: `1px solid ${activePathId === path.id ? path.color : 'rgba(255, 255, 255, 0.1)'}`,
                                        color: '#fff',
                                        padding: '12px 24px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        fontFamily: 'Orbitron',
                                        letterSpacing: '1px',
                                        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                                        boxShadow: activePathId === path.id ? `0 0 15px ${path.color}40` : 'none',
                                        transition: 'all 0.3s ease',
                                        textShadow: activePathId === path.id ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {path.title}
                                    {path.isComingSoon && (
                                        <span className="coming-soon-badge-mini" style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            background: '#ff0055',
                                            color: '#fff',
                                            fontSize: '0.5rem',
                                            padding: '2px 6px',
                                            borderBottomLeftRadius: '4px',
                                            fontWeight: 'bold'
                                        }}>
                                            SOON
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Render Active Path OR Coming Soon Placeholder */}
                        {activePath.isComingSoon ? (
                            <div className="career-path-coming-soon">
                                <div className="coming-soon-content">
                                    <div className="coming-soon-icon">
                                        <FaShieldAlt />
                                    </div>
                                    <h2 className="coming-soon-title">Coming Soon</h2>
                                    <h3 className="coming-soon-subtitle">Restricted Access // Tier 1 Clearance</h3>
                                    <p className="coming-soon-desc">
                                        The SOC Analyst Level 1 career path is currently in final development.
                                        Check back soon for authorized access to these advanced defense simulations.
                                    </p>
                                    <div className="coming-soon-lock-anim">
                                        <FaLock />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <CareerPathView
                                path={activePath}
                                onLaunchModule={handleLaunchModule}
                            />
                        )}
                    </div>
                ) : (
                    /* Course List (Catalog View) */
                    <div className="course-list">
                        <AnimatePresence>
                            {filteredCourses.map((course) => (
                                <motion.div
                                    key={course.id}
                                    className={expandedCourse === course.id ? 'course-grid-item expanded' : 'course-grid-item'}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CourseCard
                                        course={course}
                                        userProgress={userProgress}
                                        isPhaseUnlocked={isPhaseUnlocked}
                                        isExpanded={expandedCourse === course.id}
                                        onToggle={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                                        onSelectModule={(phase) => handlePhaseSelect(course, phase)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredCourses.length === 0 && (
                            <div className="no-results">
                                <FaSearch style={{ fontSize: '3rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }} />
                                <h3>No courses found</h3>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * COURSE CARD COMPONENT
 */
const CourseCard = React.memo(({ course, userProgress, isExpanded, onToggle, isPhaseUnlocked, onSelectModule }) => {
    // ... Component logic ...
    const courseStats = useMemo(() => {
        // ... (Keep existing logic)
        const isPhaseComplete = (p) => {
            const isLegacyId = ['1', '2', '3'].includes(String(p.phaseId));
            if (!isLegacyId) {
                // 1. Check New Array (Specific IDs)
                if (userProgress.completedScenarios) {
                    const completedNew = userProgress.completedScenarios.some(s => s.scenarioId === String(p.phaseId) || (p.scenarioId && s.scenarioId === String(p.scenarioId)));
                    if (completedNew) return true;
                }

                // 2. Legacy Fallback (for refined modules that match old phase numbers)
                // Specifically for Cyber Awareness which maps directly to the old global boolean flags
                if (course.id === 'security-awareness') {
                    return userProgress[`phase${p.phaseNumber}`];
                }

                return false;
            }
            return userProgress[`phase${p.phaseNumber}`];
        };

        const completedPhases = course.phases.filter(p => isPhaseComplete(p)).length;
        const totalPhases = course.phases.length;
        const progress = Math.round((completedPhases / totalPhases) * 100);

        return {
            completedPhases,
            totalPhases,
            progress,
            allComplete: progress === 100,
            earnedXP: course.phases.reduce((acc, p) => isPhaseComplete(p) ? acc + p.xpReward : acc, 0)
        };
    }, [course, userProgress]);

    return (
        <div
            className={`course-card ${isExpanded ? 'expanded' : ''} ${courseStats.allComplete ? 'completed' : ''}`}
            style={{ '--course-bg': `url("${course.image}")` }}
        >
            <div className="course-header" onClick={onToggle}>
                <div className="course-main-info">
                    <div className="course-icon" style={{ color: course.color }}>
                        {course.icon}
                    </div>
                    <div className="course-text">
                        <div className="course-category" style={{ color: course.color }}>
                            {course.category}
                        </div>
                        <h2 className="course-title">{course.title}</h2>
                        <p className="course-description">{course.description}</p>
                    </div>
                </div>

                <div className="course-meta">
                    <div className="course-stats-mini">
                        <div className="stat-mini">
                            <span className="stat-mini-label">Progress</span>
                            <span className="stat-mini-value" style={{ color: courseStats.allComplete ? '#00ff88' : course.color }}>
                                {courseStats.progress}%
                            </span>
                        </div>
                        <div className="stat-mini">
                            <span className="stat-mini-label">XP Earned</span>
                            <span className="stat-mini-value">{courseStats.earnedXP.toLocaleString()}</span>
                        </div>
                        <div className="stat-mini">
                            <span className="stat-mini-label">Phases</span>
                            <span className="stat-mini-value">{courseStats.completedPhases}/{courseStats.totalPhases}</span>
                        </div>
                    </div>

                    <div className="course-progress-bar">
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${courseStats.progress}%`, background: course.color }}
                            ></div>
                        </div>
                    </div>

                    {courseStats.allComplete && (
                        <div className="cert-earned" style={{ background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', border: '1px solid #00ff88' }}>
                            <FaCheckCircle />
                            <span>Course Complete!</span>
                        </div>
                    )}
                </div>
            </div>

            <button className="expand-btn" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
                {isExpanded ? <FaCompress /> : <FaExpand />}
            </button>

            {isExpanded && (
                <div className="course-content">
                    <div className="course-info-section">
                        <div className="info-col">
                            <h3><FaBriefcase /> Business Value</h3>
                            <p className="business-value">{course.businessValue}</p>

                            <h3><FaUsers /> Target Audience</h3>
                            <p>{course.targetAudience}</p>

                            <h3><FaChartLine /> ROI Metrics</h3>
                            <div className="roi-metrics">
                                <div className="roi-metric">
                                    <span className="roi-label">Risk Reduction</span>
                                    <span className="roi-value">{course.roi.riskReduction}</span>
                                </div>
                                <div className="roi-metric">
                                    <span className="roi-label">Avg Incident Cost</span>
                                    <span className="roi-value">{course.roi.avgIncidentCost}</span>
                                </div>
                                <div className="roi-metric">
                                    <span className="roi-label">Time to Value</span>
                                    <span className="roi-value">{course.roi.timeToValue}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-col">
                            <h3><FaLightbulb /> What You'll Be Able To Do</h3>
                            <ul className="outcomes-list">
                                {course.outcomes.map((outcome, idx) => (
                                    <li key={idx}>
                                        <FaCheckCircle style={{ color: course.color }} />
                                        <span>{outcome}</span>
                                    </li>
                                ))}
                            </ul>

                            <h3><FaMedal /> Achievement</h3>
                            <div className="cert-info">
                                <FaMedal style={{ color: '#ffd60a', fontSize: '2rem' }} />
                                <div>
                                    <strong>{course.certificateName}</strong>
                                    <p>Awarded upon completing all {course.phases.length} phases</p>
                                </div>
                            </div>

                            <div className="compliance-tags">
                                {course.roi.complianceStandards.map(std => (
                                    <span key={std} className="compliance-tag">{std}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="phases-section">
                        <h3 className="phases-title">
                            <FaRocket /> Course Phases
                        </h3>
                        <div className="phases-grid">
                            {course.phases.map((phase, idx) => {
                                const isLegacyId = ['1', '2', '3'].includes(String(phase.phaseId));
                                let isCompleted = false;

                                if (!isLegacyId) {
                                    isCompleted = userProgress.completedScenarios && userProgress.completedScenarios.some(s => s.scenarioId === String(phase.phaseId) || (phase.scenarioId && s.scenarioId === String(phase.scenarioId)));
                                } else {
                                    isCompleted = userProgress[`phase${phase.phaseNumber}`];
                                }

                                const isUnlocked = isPhaseUnlocked ? isPhaseUnlocked(phase.phaseId) : true;
                                const isLocked = !isUnlocked && !isCompleted;

                                return (
                                    <PhaseCard
                                        key={phase.phaseId}
                                        phase={phase}
                                        courseColor={course.color}
                                        isCompleted={isCompleted}
                                        isLocked={isLocked}
                                        onSelect={() => onSelectModule(phase)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

/**
 * PHASE CARD COMPONENT
 */
const PhaseCard = ({ phase, courseColor, isCompleted, isLocked, onSelect }) => {

    const difficultyColors = {
        'Beginner': '#00ff88',      // Green
        'Intermediate': '#ffd60a',  // Yellow
        'Hard': '#f97316',          // Orange
        'Insane': '#ff0055'         // Red/Pink
    };

    return (
        <div className={`phase-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}>
            <div className="phase-header">
                <div className="phase-number">Phase {phase.phaseNumber}</div>
                {isCompleted && <FaCheckCircle className="phase-check" />}
                {isLocked && <FaLock className="phase-lock" />}
            </div>

            <div className="phase-icon" style={{ color: isCompleted ? '#00ff88' : courseColor }}>
                {phase.icon}
            </div>

            <h4 className="phase-title">{phase.title}</h4>
            <p className="phase-description">{phase.description}</p>

            <div className="phase-meta">
                <div className="meta-item">
                    <FaClock />
                    <span>{phase.duration}</span>
                </div>
                <div className="meta-item" style={{ color: difficultyColors[phase.difficulty] }}>
                    <FaSignal />
                    <span>{phase.difficulty}</span>
                </div>
                <div className="meta-item">
                    <FaStar />
                    <span>{phase.xpReward} XP</span>
                </div>
            </div>

            <div className="phase-topics">
                {phase.topics.slice(0, 2).map(topic => (
                    <span key={topic} className="topic-tag">{topic}</span>
                ))}
                {phase.topics.length > 2 && <span className="topic-tag">+{phase.topics.length - 2}</span>}
            </div>

            <button
                className="phase-btn"
                onClick={onSelect}
                disabled={isLocked}
                style={{ '--btn-color': courseColor }}
            >
                {isCompleted ? <><FaCheckCircle /> Review</> : isLocked ? <><FaLock /> Locked</> : <><FaPlay /> Start Phase</>}
            </button>
        </div>
    );
};

export default TrainingLobby;
