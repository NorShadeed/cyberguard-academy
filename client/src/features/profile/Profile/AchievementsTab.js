import React, { useState } from 'react';
import {
    FaTrophy,
    FaMedal,
    FaRocket,
    FaStar,
    FaCrown,
    FaFire,
    FaShieldAlt,
    FaBolt,
    FaGem,
    FaChartLine,
    FaAward,
    FaCheck,
    FaLock,
    FaKey,
    FaUserGraduate,
    FaChessKnight,
    FaAtom
} from 'react-icons/fa';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_RARITY } from '../../../data/Achievements';
import './AchievementsTab.css'; // Uses new Apple Elegant styles

// Icon helper
const getIconHelper = (iconName) => {
    const icons = {
        FaTrophy, FaMedal, FaRocket, FaStar, FaCrown, FaFire,
        FaShieldAlt, FaBolt, FaGem, FaChartLine, FaAward,
        FaKey, FaUserGraduate, FaChessKnight, FaAtom
    };
    return icons[iconName] || FaTrophy;
};

const AchievementsTab = ({ user, gamification }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    // --- CLIENT-SIDE UNLOCK LOGIC ---
    // Patches server sync issues by checking local gamification state (Phase/Course IDs)
    const checkClientSideUnlock = (achievementId) => {
        // 1. Check if server already unlocked it
        if (user.achievements && user.achievements.some(a => a.id === achievementId)) {
            return true;
        }

        // 2. Deep Check using Gamification Node History
        // AuthContext calculates 'completedNodes' which includes Phase IDs, Scenario IDs, and Course IDs.
        const completedNodes = gamification?.completedNodes || [];

        if (achievementId === 'course_complete_awareness') {
            // A. Check if Course ID is marked complete
            if (completedNodes.includes('security-awareness')) return true;

            // B. Fallback: Check if the Final Exams are done (The "Hard" requirements)
            // 'exam_friendly_stranger' is the final exam for Cyber Awareness
            // 'sc_phishing_exam' is the mid-term
            const midTermDone = completedNodes.includes('sc_phishing_exam') || completedNodes.includes('p2_phishing_exam');
            const finalExamDone = completedNodes.includes('exam_friendly_stranger') || completedNodes.includes('p4_social_exam');

            return midTermDone && finalExamDone;
        }

        if (achievementId === 'course_complete_password') {
            // A. Check Course ID
            if (completedNodes.includes('password-mastery')) return true;

            // B. Fallback: Check Modules
            // Password Mastery currently has 2 main modules in the file I viewed
            const mod1Done = completedNodes.includes('pm_p1_psychology');
            const mod2Done = completedNodes.includes('pm_p2_fortress');

            return mod1Done && mod2Done;
        }

        return false;
    };

    // --- DATA PREPARATION ---
    const allAchievements = ACHIEVEMENTS.map(ach => {
        const isUnlocked = checkClientSideUnlock(ach.id);
        const serverData = user.achievements?.find(a => a.id === ach.id);

        return {
            ...ach,
            unlocked: isUnlocked,
            unlockedAt: serverData?.unlockedAt || (isUnlocked ? new Date().toISOString() : null) // Fallback date
        };
    });

    // Stats
    const totalCount = allAchievements.length;
    const unlockedCount = allAchievements.filter(a => a.unlocked).length;
    const progressPercent = Math.round((unlockedCount / totalCount) * 100);
    const totalXP = allAchievements.reduce((sum, a) => sum + (a.unlocked ? a.xpReward : 0), 0);

    // Categories
    const categories = [
        { id: 'all', name: 'All Awards' },
        { id: ACHIEVEMENT_CATEGORIES.TRAINING, name: 'Training' },
        { id: ACHIEVEMENT_CATEGORIES.SCENARIOS, name: 'Scenarios' },
        { id: ACHIEVEMENT_CATEGORIES.ARENA, name: 'Arena' },
        { id: ACHIEVEMENT_CATEGORIES.SPECIAL, name: 'Special' }
    ];

    // Filter
    const visibleAchievements = allAchievements.filter(a =>
        selectedCategory === 'all' || a.category === selectedCategory
    );

    // Rarity Colors (Apple Style)
    const getRarityColor = (rarity) => {
        switch (rarity) {
            case ACHIEVEMENT_RARITY.COMMON: return 'rgba(148, 163, 184, 1)'; // Slate
            case ACHIEVEMENT_RARITY.UNCOMMON: return 'rgba(50, 215, 75, 1)'; // Apple Green
            case ACHIEVEMENT_RARITY.RARE: return 'rgba(10, 132, 255, 1)'; // Apple Blue
            case ACHIEVEMENT_RARITY.EPIC: return 'rgba(191, 90, 242, 1)'; // Apple Purple
            case ACHIEVEMENT_RARITY.LEGENDARY: return 'rgba(255, 214, 10, 1)'; // Apple Gold
            default: return '#fff';
        }
    };

    return (
        <div className="achievements-apple-container">
            {/* Hero Section */}
            <div className="achievements-apple-hero">
                <h1 className="achievements-apple-title">Hall of Excellence</h1>
                <p className="achievements-apple-subtitle">Recognizing your tactical and technical superiority.</p>

                <div className="achievements-apple-stats">
                    <div className="apple-stat-item">
                        <span className="apple-stat-value">{unlockedCount} / {totalCount}</span>
                        <span className="apple-stat-label">Unlocked</span>
                    </div>
                    <div className="apple-stat-item">
                        <span className="apple-stat-value">{progressPercent}%</span>
                        <span className="apple-stat-label">Completion</span>
                    </div>
                    <div className="apple-stat-item">
                        <span className="apple-stat-value" style={{ color: '#ffd60a' }}>{totalXP.toLocaleString()}</span>
                        <span className="apple-stat-label">XP Earned</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="achievements-apple-nav">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`apple-nav-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.name}
                        {cat.id !== 'all' && (
                            <span className="apple-nav-count">
                                {allAchievements.filter(a => a.category === cat.id && a.unlocked).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="achievements-apple-grid">
                {visibleAchievements.map(ach => {
                    const Icon = getIconHelper(ach.iconName);
                    const glowColor = getRarityColor(ach.rarity);

                    return (
                        <div
                            key={ach.id}
                            className={`apple-achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`}
                            style={{ '--glow-color': glowColor }}
                        >
                            <div className="card-header-apple">
                                <div className="icon-box">
                                    <Icon />
                                </div>
                                <span className="rarity-tag" style={{ border: `1px solid ${glowColor}` }}>
                                    {ach.rarity}
                                </span>
                            </div>

                            <div className="card-content-apple">
                                <h3 className="ach-name">{ach.name}</h3>
                                <p className="ach-desc">{ach.description}</p>
                            </div>

                            <div className="card-footer-apple">
                                <div className="xp-badge">
                                    <FaStar /> {ach.xpReward} XP
                                </div>
                                <div className={`status-text ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                                    {ach.unlocked ? (
                                        <><FaCheck /> Unlocked</>
                                    ) : (
                                        <><FaLock /> Locked</>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {visibleAchievements.length === 0 && (
                <div className="apple-empty-state">
                    <FaTrophy className="apple-empty-icon" />
                    <h3>No achievements found</h3>
                    <p>Try selecting a different category.</p>
                </div>
            )}
        </div>
    );
};

export default AchievementsTab;
