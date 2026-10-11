import React from 'react';
import { ARENA_CONFIG } from '../../../utils/arenaConfig';
import { FaLock, FaTrophy, FaStar, FaBolt, FaCrown, FaChevronUp } from 'react-icons/fa';
import './ArenaTab.css';

const ArenaTab = ({ user, arenaInfo, arenaProgress }) => {



    return (
        <div className="arena-ladder-container">
            {/* Stats Overview Header */}
            <div className="arena-stats-header">
                <div className="current-arena-card">
                    <div className="arena-rank-badge">
                        <FaTrophy className="arena-badge-icon" />
                        <span className="arena-rank">Arena {user.arena}</span>
                    </div>
                    <div className="arena-title-section">
                        <h2 className="current-arena-name">{arenaInfo.name}</h2>
                        <p className="arena-tagline">{arenaInfo.description}</p>
                    </div>
                </div>

                <div className="arena-stats-grid">
                    <div className="arena-stat-card">
                        <FaStar className="arena-stat-icon" />
                        <div className="arena-stat-info">
                            <span className="arena-stat-value">{user.xp?.toLocaleString() || 0}</span>
                            <span className="arena-stat-label">Total XP</span>
                        </div>
                    </div>
                    <div className="arena-stat-card">
                        <FaTrophy className="arena-stat-icon gold" />
                        <div className="arena-stat-info">
                            <span className="arena-stat-value">{user.arena}/7</span>
                            <span className="arena-stat-label">Arena Rank</span>
                        </div>
                    </div>
                    <div className="arena-stat-card">
                        <FaBolt className="arena-stat-icon electric" />
                        <div className="arena-stat-info">
                            <span className="arena-stat-value">{arenaProgress?.progress ? `${Math.round(arenaProgress.progress)}%` : '100%'}</span>
                            <span className="arena-stat-label">Next Arena</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="arena-header">
                <h1>
                    <FaCrown className="crown-icon" />
                    Arena Progression
                </h1>
                <p>Climb the ladder • Unlock rewards • Become a legend</p>
            </div>

            {/* Arena Ladder */}
            <div className="ladder-path">
                {ARENA_CONFIG.map((config, index) => {
                    const isUnlocked = user.arena >= config.arena;
                    const isCurrent = user.arena === config.arena;
                    const isLocked = !isUnlocked;

                    const isNext = user.arena + 1 === config.arena;

                    const style = {
                        '--theme-color': config.color,
                        '--theme-glow': config.glowColor,
                        '--theme-gradient': config.gradient
                    };

                    return (
                        <div
                            key={config.arena}
                            className={`arena-tier ${isLocked ? 'locked' : 'unlocked'} ${isCurrent ? 'current' : ''} ${isNext ? 'next-arena' : ''}`}
                            style={style}
                        >
                            {/* Connector Arrow for next arena */}
                            {isNext && (
                                <div className="arena-connector">
                                    <FaChevronUp />
                                    <span>Next Goal</span>
                                    <FaChevronUp />
                                </div>
                            )}

                            <div className="arena-card-wrapper">
                                <div
                                    className="arena-card-visual"
                                    style={{ backgroundImage: `url(/images/arenas/arena-${config.arena}.png)` }}
                                >
                                    {/* Lock Overlay */}
                                    {isLocked && (
                                        <div className="lock-overlay">
                                            <div className="lock-content">
                                                <FaLock className="lock-icon" />
                                                <span className="lock-text">Requires {config.minXP.toLocaleString()} XP</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Current Arena Pulse Effect */}
                                    {isCurrent && <div className="current-pulse"></div>}

                                    {/* Arena Content */}
                                    <div className="arena-content">
                                        <div className="arena-header-badge">
                                            <span className="arena-number">Arena {config.arena}</span>
                                        </div>

                                        <h2 className="arena-name">{config.name}</h2>

                                        {!isLocked && (
                                            <div className="arena-description">
                                                {config.description}
                                            </div>
                                        )}

                                        {/* XP Requirement Badge */}
                                        <div className="xp-requirement">
                                            {config.minXP > 0 ? (
                                                <>
                                                    <FaBolt className="xp-icon" />
                                                    {config.minXP.toLocaleString()} XP
                                                </>
                                            ) : (
                                                <>
                                                    <FaStar className="xp-icon" />
                                                    Starting Arena
                                                </>
                                            )}
                                        </div>

                                        {/* Progress Bar (Current Arena Only) */}
                                        {isCurrent && arenaProgress && arenaProgress.xpNeeded > 0 && (
                                            <div className="progress-section">
                                                <div className="progress-header">
                                                    <span className="progress-percentage">{Math.round(arenaProgress.progress)}%</span>
                                                    <span className="progress-remaining">{arenaProgress.xpNeeded.toLocaleString()} XP to next</span>
                                                </div>
                                                <div className="progress-track">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${arenaProgress.progress}%` }}
                                                    >
                                                        <div className="progress-shine"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Max Arena Badge */}
                                        {isCurrent && user.arena === 7 && (
                                            <div className="max-arena-badge">
                                                <FaCrown className="max-crown" />
                                                <span>MAX ARENA REACHED</span>
                                            </div>
                                        )}


                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ArenaTab;
