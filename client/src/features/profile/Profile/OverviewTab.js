import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
    FaCheckCircle,
    FaFire,
    FaGraduationCap,
    FaTrophy,
    FaGamepad,
    FaChevronRight,
    FaStar,
    FaCrown
} from 'react-icons/fa';
import './OverviewTab.css';

import { ARENA_CONFIG } from '../../../utils/arenaConfig';

const OverviewTab = ({ user, arenaInfo, combatEfficiency, skillStats, activityData, navigate }) => {
    // Calculate correct stats using config
    const currentArenaLevel = user.arena || 1;
    const currentArena = ARENA_CONFIG.find(a => a.arena === currentArenaLevel) || ARENA_CONFIG[0];
    const nextArena = ARENA_CONFIG.find(a => a.arena === currentArenaLevel + 1);

    // XP Progress Calculation
    const currentXP = user.xp || 0;
    const nextLevelXP = nextArena ? nextArena.minXP : currentArena.minXP * 2; // Fallback if max level
    const prevLevelXP = currentArena.minXP;

    // Calculate progress within current level
    const progressInLevel = Math.max(0, currentXP - prevLevelXP);
    const totalLevelSpan = nextLevelXP - prevLevelXP;
    const arenaProgress = Math.min(100, (progressInLevel / totalLevelSpan) * 100);

    // Calculate some additional stats
    const totalMissions = user.completedScenarios?.length || 0;

    return (
        <div className="overview-container">
            {/* Apple Card Style Hero */}
            <div className="overview-hero">
                <div className="hero-content-wrapper">
                    <div className="hero-info">
                        <div className="overview-status-indicator">
                            <span className="overview-status-dot"></span>
                            Online
                        </div>

                        <h1 className="hero-title">
                            Good Morning, <span className="username-highlight">{user.username}</span>
                        </h1>

                        <div className="hero-main-stat">
                            <span className="arena-display-name">
                                {arenaInfo.name}
                            </span>
                        </div>

                        <div className="hero-substats">
                            <div className="substat-pill">
                                <FaStar />
                                <span>{currentXP.toLocaleString()} XP</span>
                            </div>
                            <div className="substat-pill">
                                <FaTrophy />
                                <span>{user.achievements?.length || 0} Awards</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* XP Progress Bar - iOS Style */}
                <div className="arena-progress-section">
                    <div className="progress-info-row">
                        <span className="progress-label">Level Progress</span>
                        <div className="progress-numbers">
                            {Math.round(arenaProgress)}%
                        </div>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill-animated"
                            style={{ width: `${arenaProgress}%` }}
                        ></div>
                    </div>
                    {nextArena && (
                        <span className="xp-remaining">
                            {(nextLevelXP - currentXP).toLocaleString()} XP until next tier
                        </span>
                    )}
                </div>
            </div>

            {/* iOS Widgets Grid */}
            <div className="overview-stats-grid">
                <div className="stat-card-premium">
                    <div className="stat-icon-wrapper cyan">
                        <FaCheckCircle />
                    </div>
                    <div className="stat-details">
                        <span className="overview-stat-value">{totalMissions}</span>
                        <span className="overview-stat-label">Completed</span>
                    </div>
                </div>

                <div className="stat-card-premium">
                    <div className="stat-icon-wrapper purple">
                        <FaCrown />
                    </div>
                    <div className="stat-details">
                        <span className="overview-stat-value">{user.arena || 1}</span>
                        <span className="overview-stat-label">Current Rank</span>
                    </div>
                </div>

                <div className="stat-card-premium">
                    <div className="stat-icon-wrapper gold">
                        <FaFire />
                    </div>
                    <div className="stat-details">
                        <span className="overview-stat-value">{currentXP.toLocaleString()}</span>
                        <span className="overview-stat-label">Total XP</span>
                    </div>
                </div>

                <div className="stat-card-premium">
                    <div className="stat-icon-wrapper orange">
                        <FaTrophy />
                    </div>
                    <div className="stat-details">
                        <span className="overview-stat-value">{user.achievements?.length || 0}</span>
                        <span className="overview-stat-label">Awards</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="overview-content-grid">

                {/* 1. Activity Consensus (Stock Chart Style) */}
                <div className="overview-card">
                    <div className="card-header">
                        <h3>Activity</h3>
                    </div>
                    <div className="activity-chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#007aff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#007aff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(30,30,35,0.8)',
                                        backdropFilter: 'blur(20px)',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#007aff' }}
                                    cursor={{ stroke: '#007aff', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#007aff"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                                <XAxis
                                    dataKey="displayDate"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 10 }}
                                    minTickGap={30}
                                />
                                <YAxis hide={true} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Fitness Rings Style Efficiency */}
                <div className="overview-card">
                    <div className="card-header">
                        <h3>Performance</h3>
                    </div>
                    <div className="efficiency-display">
                        <div className="efficiency-circle-wrapper">
                            <svg viewBox="0 0 36 36" className="circular-chart">
                                <path
                                    className="circle-bg"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    style={{ stroke: 'rgba(255,255,255,0.1)' }}
                                />
                                <path
                                    className="circle-progress"
                                    strokeDasharray={`${combatEfficiency}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    style={{ stroke: '#32d74b', strokeLinecap: 'round' }}
                                />
                                <text
                                    x="50%"
                                    y="50%"
                                    className="percentage-text"
                                    style={{
                                        fontSize: '0.6rem',
                                        fontWeight: 'bold',
                                        dominantBaseline: 'middle',
                                        textAnchor: 'middle'
                                    }}
                                >
                                    {combatEfficiency}%
                                </text>
                            </svg>
                        </div>
                        <p className="efficiency-label">Combat Efficiency</p>
                    </div>
                </div>

                {/* 3. Skill Proficiency */}
                <div className="overview-card">
                    <div className="card-header">
                        <h3>Proficiency</h3>
                    </div>
                    <div className="skills-list">
                        {skillStats.map((skill, index) => (
                            <div key={index} className="skill-item">
                                <div className="skill-info-row">
                                    <span className="skill-name">{skill.name}</span>
                                    <span className="skill-percentage">{skill.percent}%</span>
                                </div>
                                <div className="skill-bar">
                                    <div
                                        className="skill-fill"
                                        style={{
                                            width: `${skill.percent}%`,
                                            // iOS System Colors Map
                                            background: index === 0 ? '#ff3b30' : // Red
                                                index === 1 ? '#32d74b' : // Green
                                                    index === 2 ? '#007aff' : // Blue
                                                        '#af52de'                 // Purple
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Quick Actions */}
                <div className="overview-card">
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="action-links">
                        <div className="action-link" onClick={() => navigate('/scenarios')}>
                            <div className="action-icon scenarios">
                                <FaGamepad />
                            </div>
                            <div className="action-text">
                                <h4>Continue Mission</h4>
                                <p>Resume your progress</p>
                            </div>
                            <FaChevronRight className="action-arrow" />
                        </div>

                        <div className="action-link" onClick={() => navigate('/training')}>
                            <div className="action-icon training">
                                <FaGraduationCap />
                            </div>
                            <div className="action-text">
                                <h4>Academy</h4>
                                <p>Learn new skills</p>
                            </div>
                            <FaChevronRight className="action-arrow" />
                        </div>

                        <div className="action-link" onClick={() => navigate('/profile/achievements')}>
                            <div className="action-icon achievements">
                                <FaTrophy />
                            </div>
                            <div className="action-text">
                                <h4>Achievements</h4>
                                <p>{user.achievements?.length || 0} collected</p>
                            </div>
                            <FaChevronRight className="action-arrow" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OverviewTab;
