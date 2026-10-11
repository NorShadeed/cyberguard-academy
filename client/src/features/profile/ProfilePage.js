import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { ARENA_CONFIG, getArenaInfo, getArenaProgress } from '../../utils/arenaConfig';
import {
    FaShieldAlt, FaTrophy, FaCertificate, FaSignOutAlt,
    FaCog, FaUser, FaCrown
} from 'react-icons/fa';
import './ProfilePage.css';

// Sub-components
import OverviewTab from './Profile/OverviewTab';
import ArenaTab from './Profile/ArenaTab';
import CertificatesTab from './Profile/CertificatesTab';
import AchievementsTab from './Profile/AchievementsTab';
import SettingsTab from './Profile/SettingsTab';

// Avatar options (Need to keep this for the sidebar display)
const AVATAR_OPTIONS = [
    { id: 'sentinel', src: '/images/hero-sentinel.png', name: 'The Sentinel' },
    { id: 'strategist', src: '/images/hero-strategist.png', name: 'The Strategist' },
    { id: 'arbiter', src: '/images/hero-arbiter.png', name: 'The Arbiter' }
];

const ProfilePage = () => {
    const { user, loading, logout, token, refreshUser, gamification } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab based on current path
    const getActiveTab = () => {
        const path = location.pathname.split('/').pop();
        if (path === 'profile' || path === '') return 'overview';
        return path;
    };
    const activeTab = getActiveTab();

    // Auto-refresh user data on page load
    useEffect(() => {
        if (refreshUser) {
            refreshUser();
        }
    }, [refreshUser]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            navigate('/auth');
        }
    }, [loading, user, navigate]);

    if (loading) return (
        <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>LOADING COMMAND CENTER...</p>
        </div>
    );

    if (!user) return null; // Prevent flash before redirect

    // Core User & Arena Stats (Required for Sidebar & Props)
    const arenaInfo = getArenaInfo(user.arena || 1);
    const arenaProgress = getArenaProgress(user.xp || 0, user.arena || 1);
    const currentAvatarSrc = AVATAR_OPTIONS.find(a => a.id === (user.avatar || 'sentinel'))?.src || AVATAR_OPTIONS[0].src;

    // --- SHARED ANALYTICS CALCULATIONS (Pass to Overview) ---
    // 1. Combat Efficiency
    // 1. Combat Efficiency
    let combatEfficiency = 0;
    if (user.stats && user.stats.totalQuestionsAnswered > 0) {
        combatEfficiency = Math.round((user.stats.correctQuestionsAnswered / user.stats.totalQuestionsAnswered) * 100);
    } else {
        // Fallback for legacy users
        combatEfficiency = Math.min(Math.round((user.xp / (user.level * 1000)) * 100), 100) || 0;
    }

    // 2. Skill Proficiency
    const calculateSkills = () => {
        const skills = {
            'Social Engineering': { current: 0, total: 20 },
            'Network Security': { current: 0, total: 20 },
            'Incident Response': { current: 0, total: 20 },
            'Ethical Hacking': { current: 0, total: 20 }
        };

        if (user.completedScenarios) {
            user.completedScenarios.forEach((sc, index) => {
                const cats = Object.keys(skills);
                const assignedCat = cats[index % cats.length];
                skills[assignedCat].current += 5; // Assume 5% per scenario
            });
        }

        return Object.entries(skills).map(([name, data]) => ({
            name,
            percent: Math.min(Math.round((data.current / data.total) * 100), 100)
        }));
    };
    const skillStats = calculateSkills();

    // 3. Deployment Activity
    // 3. Activity History (Bitcoin-style Graph)
    const calculateActivity = () => {
        // Collect all timestamped events
        const events = [];

        // Scenarios
        if (user.completedScenarios) {
            user.completedScenarios.forEach(s => {
                const date = s.completedAt || s.timestamp; // Handle both backend/frontend keys
                if (date) events.push({ date: new Date(date), weight: 30, type: 'Mission' });
            });
        }

        // Achievements
        if (user.achievements) {
            user.achievements.forEach(a => {
                if (a.unlockedAt) events.push({ date: new Date(a.unlockedAt), weight: 50, type: 'Achievement' });
            });
        }

        // Certificates
        if (user.certificates) {
            user.certificates.forEach(c => {
                if (c.earnedAt) events.push({ date: new Date(c.earnedAt), weight: 100, type: 'Certificate' });
            });
        }

        // Account Creation (Base) - if created_at exists, or user fallback
        if (user.createdAt) {
            events.push({ date: new Date(user.createdAt), weight: 10, type: 'Join' });
        }

        // Sort events
        events.sort((a, b) => a.date - b.date);

        // Determine Start Date (Go back at least 14 days, or to first event)
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 14); // Default view

        if (events.length > 0 && events[0].date < startDate) {
            startDate = new Date(events[0].date);
        }
        // Normalize start date to beginning of day
        startDate.setHours(0, 0, 0, 0);

        // Generate complete timeline (fill gaps with 0)
        const timeline = [];
        const currentDate = new Date(startDate);

        while (currentDate <= today) {
            // Use local date string for comparison to match user's perspective
            const comparisonDateStr = currentDate.toDateString();
            const displayDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            // Sum activity for this day (using local date comparison)
            const dayEvents = events.filter(e => e.date.toDateString() === comparisonDateStr);
            const score = dayEvents.reduce((acc, curr) => acc + curr.weight, 0);

            timeline.push({
                date: currentDate.toISOString(), // Keep ISO for potential sorting if needed
                displayDate: displayDate,
                value: score, // STRICTLY REAL DATA - NO FAKE NOISE
                realScore: score,
                events: dayEvents.length
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return timeline;
    };
    const activityData = calculateActivity();

    // Tab definitions for Sidebar
    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FaUser />, path: '/profile/overview' },
        { id: 'arena', label: 'Arena', icon: <FaCrown />, path: '/profile/arena' },
        { id: 'certificates', label: 'Certificates', icon: <FaCertificate />, path: '/profile/certificates' },
        { id: 'achievements', label: 'Achievements', icon: <FaTrophy />, path: '/profile/achievements' },
        { id: 'settings', label: 'Settings', icon: <FaCog />, path: '/profile/settings' }
    ];

    return (
        <div className="profile-dashboard">
            <div className="profile-container">
                {/* === SIDEBAR === */}
                <aside className="profile-sidebar">
                    <div className="profile-sidebar-header">
                        <div className="avatar-container" style={{ '--arena-color': arenaInfo.color }}>
                            <img src={currentAvatarSrc} alt="Avatar" className="sidebar-avatar" />
                            <div className="level-badge">{user.level}</div>
                        </div>
                        <h2 className="sidebar-username">{user.username}</h2>
                    </div>

                    <nav className="sidebar-nav">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => navigate(tab.path)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <button className="sidebar-logout-btn" onClick={logout}>
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </aside>

                {/* === MAIN CONTENT === */}
                <main className="profile-main">
                    <Routes>
                        <Route index element={<Navigate to="overview" replace />} />
                        <Route path="overview" element={
                            <OverviewTab
                                user={user}
                                arenaInfo={arenaInfo}
                                combatEfficiency={combatEfficiency}
                                skillStats={skillStats}
                                activityData={activityData}
                                navigate={navigate}
                            />
                        } />
                        <Route path="arena" element={
                            <ArenaTab
                                user={user}
                                arenaInfo={arenaInfo}
                                arenaProgress={arenaProgress}
                            />
                        } />
                        <Route path="certificates" element={
                            <CertificatesTab
                                user={user}
                                navigate={navigate}
                                token={token}
                                gamification={gamification}
                            />
                        } />
                        <Route path="achievements" element={
                            <AchievementsTab
                                user={user}
                                gamification={gamification}
                                navigate={navigate}
                            />
                        } />
                        <Route path="settings" element={
                            <SettingsTab
                                user={user}
                                token={token}
                                refreshUser={refreshUser}
                            />
                        } />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
