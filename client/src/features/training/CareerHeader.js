import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './CareerHeader.css';
import { FaShieldAlt, FaMedal, FaClock, FaLayerGroup, FaCheckCircle } from 'react-icons/fa';

const CareerHeader = ({ path }) => {
    const { gamification } = useContext(AuthContext);

    // Calculate Progress %
    // Logic: Count how many nodes in THIS path are in gamification.completedNodes
    const totalNodes = path.nodes.length;
    const completedCount = path.nodes.filter(node => gamification.completedNodes.includes(node.id)).length;
    const progressPercent = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

    return (
        <div className="career-header-wrapper">

            {/* LEFT: INFO & IDENTITY */}
            <div className="header-identity">
                {/* Main Title */}
                <h1 className="header-title">{path.title}</h1>

                {/* Sub-header / Role */}
                <div className="header-subtitle">
                    <span className="subtitle-label">TARGET ROLE:</span>
                    <span className="subtitle-value">{path.role}</span>
                </div>

                {/* Detailed Description / "Why take this" */}
                <div className="header-details-block">
                    <p className="header-mission">
                        {path.details?.summary || path.description}
                    </p>

                    {path.details?.learningObjectives && (
                        <div className="learning-objectives">
                            <span className="obj-label">KEY OBJECTIVES:</span>
                            <ul className="obj-list">
                                {path.details.learningObjectives.map((obj, i) => (
                                    <li key={i}>{obj}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: STATS & PROGRESS */}
            <div className="header-stats-deck">

                {/* Completion % (Replaces bar) */}
                <div className="stat-module huge-stat">
                    <span className="stat-label">COMPLETION STATUS</span>
                    <span className={`stat-value ${progressPercent === 100 ? 'gold' : 'cyan'}`}>
                        {progressPercent}%
                    </span>
                </div>

                <div className="stat-row-group">
                    <div className="stat-module">
                        <span className="stat-label">DIFFICULTY</span>
                        <span className="stat-value small">
                            {path.difficulty?.toUpperCase() || 'TIER 1'}
                        </span>
                    </div>

                    <div className="stat-module">
                        <span className="stat-label">EST. DURATION</span>
                        <span className="stat-value small">
                            {path.estimatedTime || '40H'}
                        </span>
                    </div>
                </div>

            </div>

            {/* No Decorative Line - User requested removal of progress bar graphic */}
        </div>
    );
};

export default CareerHeader;
