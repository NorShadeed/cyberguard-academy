import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../features/auth/AuthContext';
import { getAllModules } from '../../data/ModuleRegistry'; // Fail-safe Import
import './CareerPath.css';
import './ForceTransparent.css';
import {
    FaLock,
    FaCheck,
    FaPlay,
    FaStar,
    FaShieldAlt,
    FaMedal,
    FaLayerGroup,
    FaClock,
    FaAtom,
    FaTrophy,
    FaFire,
    FaBolt,
    FaCertificate
} from 'react-icons/fa';

// ... (Header comments remain)

const CareerPathView = ({ path, onLaunchModule }) => {
    const { gamification, user, completeNode } = useContext(AuthContext);
    const [selectedNode, setSelectedNode] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);
    const [isAnimating, setIsAnimating] = useState(true);

    // ========================================================================
    // DYNAMIC COMPLETION CHECK (FAIL-SAFE)
    // ========================================================================
    const isCourseFullyComplete = useCallback((catalogId) => {
        if (!user || !catalogId) return false;

        const modules = getAllModules();
        const course = modules.find(m => m.id === catalogId);
        if (!course || !course.phases) return false;

        // Check if every phase is complete based on User Profile
        let allPhasesComplete = true;
        let finalExamPassed = false;

        course.phases.forEach(phase => {
            let isComplete = false;
            // 1. Check Scenario Completion
            if (user.completedScenarios && user.completedScenarios.some(s => s.scenarioId === String(phase.phaseId) || (phase.scenarioId && s.scenarioId === String(phase.scenarioId)))) {
                isComplete = true;
            }
            // 2. Check Legacy Certification (Only for legacy phase IDs)
            const legacyKey = `phase${phase.phaseNumber}`;
            const isLegacyId = ['1', '2', '3'].includes(String(phase.phaseId));

            if (isLegacyId && user.certificationStatus && user.certificationStatus[legacyKey]) {
                isComplete = true;
            }

            if (isComplete) {
                if (String(phase.phaseId).includes('exam') || (phase.title && phase.title.toLowerCase().includes('exam'))) {
                    finalExamPassed = true;
                }
            } else {
                allPhasesComplete = false;
            }
        });

        return allPhasesComplete || finalExamPassed;
    }, [user]);

    // ========================================================================
    // PROGRESS CALCULATION
    // ========================================================================
    const totalNodes = path.nodes.length;

    // Check completion using prioritized logic (Dynamic > Local)
    const completedCount = path.nodes.filter(node => {
        if (node.catalogId) {
            return isCourseFullyComplete(node.catalogId);
        }
        return gamification.completedNodes.includes(node.id);
    }).length;

    const progressPercent = totalNodes > 0
        ? Math.round((completedCount / totalNodes) * 100)
        : 0;

    // ========================================================================
    // NODE STATE HELPERS
    // ========================================================================

    const isCompleted = useCallback((node) => {
        // PRIORITIZE DYNAMIC CHECK for Courses (Fixes "False Positive" from poisoned local state)
        if (node.catalogId) {
            return isCourseFullyComplete(node.catalogId);
        }

        // Fallback to Local Gamification State for non-catalog nodes
        return gamification.completedNodes.includes(node.id);
    }, [gamification.completedNodes, isCourseFullyComplete]);

    // Auto-Sync Effect
    useEffect(() => {
        path.nodes.forEach(node => {
            if (node.catalogId && isCourseFullyComplete(node.catalogId)) {
                if (!gamification.completedNodes.includes(node.id)) {
                    if (completeNode) completeNode(node.id);
                }
            }
        });
    }, [path.nodes, gamification.completedNodes, isCourseFullyComplete, completeNode]);

    const isUnlocked = useCallback((node) => {
        // Always unlock the first node if no connections defined
        if (node.connections && node.connections.length > 0) {
            // Check if ALL parent nodes are completed
            return node.connections.every(parentId => {
                const parent = path.nodes.find(n => n.id === parentId);
                return parent ? isCompleted(parent) : true;
            });
        }

        const nodeIndex = path.nodes.indexOf(node);
        if (nodeIndex === 0) return true;

        const previousNode = path.nodes[nodeIndex - 1];
        if (!previousNode) return true;

        return isCompleted(previousNode);
    }, [path.nodes, isCompleted]);

    const getNodeIcon = (node, unlocked, completed) => {
        if (completed) {
            return <FaCheck size={22} />;
        }
        if (!unlocked) {
            return <FaLock size={18} />;
        }
        switch (node.type) {
            case 'scenario': return <FaPlay size={20} style={{ marginLeft: 3 }} />;
            case 'certification': return <FaTrophy size={20} />;
            case 'challenge': return <FaBolt size={20} />;
            default: return <FaPlay size={20} style={{ marginLeft: 3 }} />;
        }
    };

    // ========================================================================
    // LIFECYCLE & EFFECTS
    // ========================================================================

    useEffect(() => {
        // Disable entry animations after initial mount
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    // ========================================================================
    // INTERACTIVE MAP STATE
    // ========================================================================
    const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = React.useRef(null);

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleNativeWheel = (e) => {
            e.preventDefault();
            const scaleAmount = -e.deltaY * 0.001;

            setViewport(prev => {
                const newScale = Math.min(Math.max(0.5, prev.scale + scaleAmount), 3);
                return {
                    ...prev,
                    scale: newScale
                };
            });
        };

        // Passive: false is required to prevent default scroll
        container.addEventListener('wheel', handleNativeWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleNativeWheel);
        };
    }, []);

    const handleMouseDown = (e) => {
        // Only drag if clicking background, not nodes
        if (e.target.closest('.hex-node-wrapper') || e.target.closest('.holo-panel')) return;

        setIsDragging(true);
        setDragStart({
            x: e.clientX - viewport.x,
            y: e.clientY - viewport.y
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        setViewport(prev => ({
            ...prev,
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleZoomIn = () => {
        setViewport(prev => ({ ...prev, scale: Math.min(prev.scale + 0.2, 3) }));
    };

    const handleZoomOut = () => {
        setViewport(prev => ({ ...prev, scale: Math.max(prev.scale - 0.2, 0.5) }));
    };

    const handleResetView = () => {
        setViewport({ x: 0, y: 0, scale: 1 });
    };

    const handleNodeClick = (node) => {
        // If clicking a node, stop any slight drag that might have occurred
        if (!isDragging) {
            setSelectedNode(node);
        }
    };

    const handleNodeHover = (node) => {
        setHoveredNode(node);
    };

    const handleNodeLeave = () => {
        setHoveredNode(null);
    };

    const handleClosePanel = () => {
        setSelectedNode(null);
    };

    const handleLaunchClick = () => {
        if (selectedNode && isUnlocked(selectedNode)) {
            onLaunchModule(selectedNode);
        }
    };

    // ========================================================================
    // RENDER HELPER FUNCTIONS
    // ========================================================================

    /**
     * Renders the SVG connection lines between nodes
     */
    const renderConnections = () => {
        return path.nodes.map((node, index) => {
            // New DAG Logic: Check for explicit parents
            if (node.connections && node.connections.length > 0) {
                return node.connections.map((parentId, i) => {
                    const parent = path.nodes.find(n => n.id === parentId);
                    if (!parent) return null;

                    const x1 = parent.position.x + "%";
                    const y1 = parent.position.y + "%";
                    const x2 = node.position.x + "%";
                    const y2 = node.position.y + "%";

                    const isActive = isCompleted(parent);

                    return (
                        <line
                            key={`line-${node.id}-${parentId}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            className={`connector-line ${isActive ? 'active' : ''}`}
                        />
                    );
                });
            }

            // Fallback: Linear Sequential Logic
            if (index === 0) return null;

            const previousNode = path.nodes[index - 1];
            const x1 = previousNode.position.x + "%";
            const y1 = previousNode.position.y + "%";
            const x2 = node.position.x + "%";
            const y2 = node.position.y + "%";

            const isActive = isCompleted(previousNode);

            return (
                <line
                    key={`line-${index}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={`connector-line ${isActive ? 'active' : ''}`}
                />
            );
        });
    };

    /**
     * Renders all hexagonal nodes on the map
     */
    const renderNodes = () => {
        return path.nodes.map((node) => {
            const unlocked = isUnlocked(node);
            const completed = isCompleted(node);
            const isHovered = hoveredNode?.id === node.id;
            const isSelected = selectedNode?.id === node.id;

            // Counter-scale nodes so they stay readable size when map is zoomed way out?
            // Optional optimization, for now let them scale.

            return (
                <div
                    key={node.id}
                    className={`hex-node-wrapper ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''} ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}
                    style={{
                        left: `${node.position.x}%`,
                        top: `${node.position.y}%`
                    }}
                    onClick={(e) => { e.stopPropagation(); handleNodeClick(node); }}
                    onMouseEnter={() => handleNodeHover(node)}
                    onMouseLeave={handleNodeLeave}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.title} - ${unlocked ? 'Available' : 'Locked'}`}
                >
                    <div className="hex-node-content">
                        <div className="hex-inner">
                            {getNodeIcon(node, unlocked, completed)}
                        </div>
                    </div>
                    <div className="hex-pulse"></div>
                    <div className="node-label">
                        {node.title}
                    </div>
                </div>
            );
        });
    };

    /**
     * Renders the detail panel as a "Terminal Window"
     */
    const renderDetailPanel = () => {
        if (!selectedNode) return null;

        const unlocked = isUnlocked(selectedNode);
        const completed = isCompleted(selectedNode);

        // Terminal typing effect logic could be added here, 
        // but for now we'll start with the structure.

        return (
            <div className="terminal-modal-overlay" onClick={handleClosePanel}>
                <div className="terminal-window" onClick={(e) => e.stopPropagation()}>
                    {/* Terminal Header / Title Bar */}
                    <div className="terminal-header">
                        <div className="terminal-controls">
                            <span className="ctrl red"></span>
                            <span className="ctrl yellow"></span>
                            <span className="ctrl green"></span>
                        </div>
                        <div className="terminal-title">
                            root@titan-range: ~/missions/{selectedNode.id}
                        </div>
                    </div>

                    {/* Terminal Content */}
                    <div className="terminal-body">
                        {/* Command History Simulation */}
                        <div className="term-line">
                            <span className="prompt">root@titan:~$</span>
                            <span className="cmd"> decrypt_mission --target "{selectedNode.title}"</span>
                        </div>

                        <div className="term-line output success">
                            [SUCCESS] Decryption complete. Accessing secure files...
                        </div>

                        <div className="term-spacer"></div>

                        {/* Mission Manifest (Header) */}
                        <div className="term-block">
                            <div className="term-ascii-header">
                                {`
  _   _                 _ 
 | \\ | |               | |
 |  \\| | ___   __| | ___ 
 | . \` |/ _ \\ / _\` |/ _ \\
 | |\\  | (_) | (_| |  __/
 |_| \\_|\\___/ \\__,_|\\___|
                                `}
                            </div>
                            <div className="term-kv-pair">
                                <span className="key">TARGET_ID:</span>
                                <span className="val">{selectedNode.id.toUpperCase()}</span>
                            </div>
                            <div className="term-kv-pair">
                                <span className="key">SECURITY_LEVEL:</span>
                                <span className="val" style={{ color: unlocked ? '#0f0' : '#f00' }}>
                                    {unlocked ? 'CLEARED' : 'LOCKED (LEVEL ' + (path.nodes.indexOf(selectedNode)) + ' REQUIRED)'}
                                </span>
                            </div>
                            <div className="term-kv-pair">
                                <span className="key">EST_XP_YIELD:</span>
                                <span className="val warn">{selectedNode.xp} XP</span>
                            </div>
                        </div>

                        <div className="term-spacer"></div>

                        {/* Mission Description (cat description.txt) */}
                        <div className="term-line">
                            <span className="prompt">root@titan:~$</span>
                            <span className="cmd"> cat briefing.txt</span>
                        </div>
                        <div className="term-text-content">
                            {selectedNode.description}
                        </div>

                        {/* Interactive Prompt (Launch) */}
                        <div className="term-spacer"></div>
                        <div className="term-interaction-area">
                            {!unlocked ? (
                                <div className="term-line error">
                                    [ERROR] PERMISSION DENIED. COMPLETE PREVIOUS MODULES.
                                </div>
                            ) : (
                                <div className="term-prompt-active">
                                    <span className="prompt">root@titan:~$</span>
                                    <span className="cursor-input">./initiate_sequence.sh</span>
                                    <span className="cursor-blink">█</span>
                                </div>
                            )}

                            {/* Hidden/Styled Launch Button Overlay */}
                            {unlocked && (
                                <button
                                    className="terminal-exec-btn"
                                    onClick={handleLaunchClick}
                                >
                                    [ EXECUTE ]
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ========================================================================
    // MAIN RENDER
    // ========================================================================

    return (
        <div className="career-path-container">
            {/* ================================================================
                INTEGRATED CINEMATIC HEADER
                ================================================================ */}
            <header className="integrated-header">
                {/* Background Reactor Core Effect */}
                <div className="reactor-glow"></div>

                {/* Centered Title Block */}
                <div className="title-block centered">
                    <h1 className="cinematic-title">{path.title}</h1>
                    <div className="role-chip">
                        <FaShieldAlt className="role-icon" />
                        <span>{path.role}</span>
                    </div>
                    <div className="cert-reward-badge" style={{
                        marginTop: '15px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#ffd700',
                        background: 'rgba(255, 215, 0, 0.1)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                    }}>
                        <FaCertificate />
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>CERTIFICATE AWARDED</span>
                    </div>
                </div>

                {/* Two-Column Content Grid */}
                <div className="header-grid-content">
                    {/* LEFT COLUMN - Mission Briefing */}
                    <div className="header-left">
                        <div className="briefing-panel">
                            <p className="briefing-text">
                                {path.details?.summary || path.description}
                            </p>

                            {path.details?.learningObjectives && (
                                <div className="obj-container">
                                    <span className="obj-title">TACTICAL OBJECTIVES</span>
                                    <ul className="obj-list">
                                        {path.details.learningObjectives.map((obj, i) => (
                                            <li key={i}>{obj}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Systems Status */}
                    <div className="header-right">
                        {/* Circular Progress Ring */}
                        <div className="status-module main-status">
                            <div className="status-ring-container">
                                <svg viewBox="0 0 100 100" className="progress-ring">
                                    <circle className="ring-bg" cx="50" cy="50" r="45" />
                                    <circle
                                        className="ring-value"
                                        cx="50" cy="50" r="45"
                                        strokeDasharray={`${progressPercent * 2.83} 283`}
                                    />
                                </svg>
                                <div className="ring-text">
                                    <span className="ring-percent">{progressPercent}%</span>
                                    <span className="ring-label">SYNC</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="status-grid">
                            <div className="grid-stat">
                                <span className="stat-label">DIFFICULTY</span>
                                <span className="stat-val gold">
                                    {path.difficulty?.toUpperCase() || 'TIER 1'}
                                </span>
                            </div>
                            <div className="grid-stat">
                                <span className="stat-label">EST. TIME</span>
                                <span className="stat-val cyan">
                                    {path.estimatedTime || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ================================================================
                TACTICAL GRID MAP - Node Visualization
                ================================================================ */}
            {/* ================================================================
                TACTICAL GRID MAP - Interactive Node Visualization
                ================================================================ */}
            <div className="metro-map-wrapper">
                <div
                    ref={containerRef}
                    className="premium-grid interactive-container"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                    {/* VISUAL OVERLAYS - STATIC HUD */}
                    <div className="hud-corner top-left"></div>
                    <div className="hud-corner top-right"></div>
                    <div className="hud-corner bottom-left"></div>
                    <div className="hud-corner bottom-right"></div>
                    <div className="hud-grid-overlay"></div>

                    {/* TRANSFORM LAYER - MOVES/SCALES */}
                    <div
                        className="transform-layer"
                        style={{
                            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
                            transformOrigin: 'center center' // Or dynamic based on mouse
                        }}
                    >
                        {/* Dynamic Background Grid that moves with map */}
                        <div className="dynamic-grid-bg"></div>

                        {/* SVG Layer - Connection Lines */}
                        <svg className="path-svg">
                            <defs>
                                {/* Glow filter for enhanced lines */}
                                <filter id="glow-line" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>

                                {/* Animated gradient for active connection lines */}
                                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="rgba(0, 212, 255, 0.2)">
                                        <animate
                                            attributeName="stop-color"
                                            values="rgba(0, 212, 255, 0.2); rgba(0, 212, 255, 0.8); rgba(0, 212, 255, 0.2)"
                                            dur="2s"
                                            repeatCount="indefinite"
                                        />
                                    </stop>
                                    <stop offset="50%" stopColor="rgba(0, 212, 255, 1)">
                                        <animate
                                            attributeName="offset"
                                            values="0; 1; 0"
                                            dur="3s"
                                            repeatCount="indefinite"
                                        />
                                    </stop>
                                    <stop offset="100%" stopColor="rgba(0, 212, 255, 0.2)">
                                        <animate
                                            attributeName="stop-color"
                                            values="rgba(0, 212, 255, 0.2); rgba(0, 212, 255, 0.8); rgba(0, 212, 255, 0.2)"
                                            dur="2s"
                                            repeatCount="indefinite"
                                        />
                                    </stop>
                                </linearGradient>
                            </defs>

                            {/* Render all connection lines */}
                            {renderConnections()}
                        </svg>

                        {/* Hexagonal Node Layer */}
                        {renderNodes()}
                    </div>

                    {/* CONTROLS OVERLAY */}
                    <div className="map-controls">
                        <button onClick={handleZoomIn} aria-label="Zoom In">+</button>
                        <button onClick={handleResetView} aria-label="Reset View">⟲</button>
                        <button onClick={handleZoomOut} aria-label="Zoom Out">-</button>
                    </div>
                </div>
            </div>

            {/* ================================================================
                HOLOGRAPHIC DETAIL PANEL - Selected Node Info
                ================================================================ */}
            {renderDetailPanel()}
        </div>
    );
};

export default CareerPathView;
