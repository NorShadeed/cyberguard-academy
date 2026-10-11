import React, { useState, useEffect } from 'react';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaCheckCircle,
    FaShieldAlt,
    FaSave,
    FaUserCog,
    FaCamera,
    FaFileAlt,
    FaExclamationCircle
} from 'react-icons/fa';
import './SettingsTab.css';

// Avatar options
const AVATAR_OPTIONS = [
    {
        id: 'sentinel',
        src: '/images/hero-sentinel.png',
        name: 'The Sentinel',
        description: 'Elite Digital Guardian',
        rarity: 'Common'
    },
    {
        id: 'strategist',
        src: '/images/hero-strategist.png',
        name: 'The Strategist',
        description: 'Master of Tactics',
        rarity: 'Rare'
    },
    {
        id: 'arbiter',
        src: '/images/hero-arbiter.png',
        name: 'The Arbiter',
        description: 'Cyber Justice Enforcer',
        rarity: 'Epic'
    },
    {
        id: 'phantom',
        src: '/images/hero-phantom.png',
        name: 'The Phantom',
        description: 'Stealth Operative',
        rarity: 'Legendary'
    },
    {
        id: 'vanguard',
        src: '/images/hero-vanguard.png',
        name: 'The Vanguard',
        description: 'Frontline Defender',
        rarity: 'Rare'
    }
];

const SettingsTab = ({ user, token, refreshUser }) => {
    // Form States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    // Password States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Avatar State
    const [selectedAvatar, setSelectedAvatar] = useState('');

    // UI States
    const [settingsMsg, setSettingsMsg] = useState({ type: '', text: '' });
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');

    useEffect(() => {
        if (user) {
            if (!firstName) setFirstName(user.firstName || '');
            if (!lastName) setLastName(user.lastName || '');
            if (!email) setEmail(user.email || '');
            // Only set avatar if it hasn't been touched or if we're initializing
            if (!selectedAvatar) setSelectedAvatar(user.avatar || 'sentinel');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.firstName, user?.lastName, user?.email, user?.avatar]);

    const showMessage = (type, text) => {
        setSettingsMsg({ type, text });
        setTimeout(() => setSettingsMsg({ type: '', text: '' }), 4000);
    };

    const handleProfileUpdate = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setSettingsMsg({ type: '', text: '' });

        try {
            // Note: We only send email and avatar. Names are locked.
            const payload = {
                email,
                avatar: selectedAvatar
                // firstName and lastName are NOT included to prevent fabrication
            };

            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                showMessage('success', 'Profile updated successfully');
                refreshUser();
            } else {
                showMessage('error', data.msg || 'Update failed');
            }
        } catch (err) {
            showMessage('error', 'Connection error');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showMessage('error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            showMessage('error', 'Password must be at least 8 characters');
            return;
        }

        setSaving(true);
        setSettingsMsg({ type: '', text: '' });

        try {
            const res = await fetch('/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await res.json();
            if (res.ok) {
                showMessage('success', 'Security credentials updated');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                showMessage('error', data.msg || 'Password change failed');
            }
        } catch (err) {
            showMessage('error', 'Connection error');
        } finally {
            setSaving(false);
        }
    };

    const sections = [
        { id: 'profile', name: 'Identity', icon: FaUser },
        { id: 'avatar', name: 'Avatar', icon: FaCamera },
        { id: 'security', name: 'Security', icon: FaShieldAlt },
        { id: 'account', name: 'Account', icon: FaUserCog }
    ];

    return (
        <div className="settings-pg-container">
            {/* Header */}
            <div className="settings-pg-header">
                <div className="settings-pg-header-icon">
                    <FaUserCog />
                </div>
                <div className="settings-pg-header-content">
                    <h1 className="settings-pg-title">Settings</h1>
                    <p className="settings-pg-subtitle">Manage your account preferences and security.</p>
                </div>
            </div>

            {/* Notification System */}
            {settingsMsg.text && (
                <div className={`settings-pg-toast ${settingsMsg.type}`}>
                    {settingsMsg.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                    <span>{settingsMsg.text}</span>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="settings-pg-nav">
                {sections.map(section => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.id}
                            className={`settings-pg-tab ${activeSection === section.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            <Icon />
                            {section.name}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="settings-pg-content">

                {/* PROFILE SECTION */}
                {activeSection === 'profile' && (
                    <div className="settings-pg-panel">
                        <div className="settings-pg-panel-header">
                            <h2><FaFileAlt /> Operator Identity</h2>
                            <p>Personal identification credentials</p>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="settings-pg-form">
                            <div className="settings-pg-group">
                                <label><FaEnvelope /> Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="settings-pg-input"
                                    placeholder="Enter secure email frequency"
                                    required
                                />
                            </div>

                            <button type="submit" className="settings-pg-btn" disabled={saving}>
                                <FaSave />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                )}

                {/* AVATAR SECTION */}
                {activeSection === 'avatar' && (
                    <div className="settings-pg-panel">
                        <div className="settings-pg-panel-header">
                            <h2><FaCamera /> Visual Interface</h2>
                            <p>Select your digital representation</p>
                        </div>

                        <div className="settings-pg-avatar-grid">
                            {AVATAR_OPTIONS.map(avatar => (
                                <div
                                    key={avatar.id}
                                    className={`settings-pg-avatar-option ${selectedAvatar === avatar.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedAvatar(avatar.id)}
                                >
                                    <div className="settings-pg-avatar-img">
                                        <img src={avatar.src} alt={avatar.name} />
                                    </div>
                                    <span className="settings-pg-avatar-name">{avatar.name}</span>
                                    <span className="settings-pg-avatar-rarity">{avatar.rarity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="panel-actions">
                            <button
                                onClick={handleProfileUpdate}
                                className="settings-pg-btn"
                                disabled={saving}
                            >
                                <FaSave />
                                {saving ? 'Updating...' : 'Set Avatar'}
                            </button>
                        </div>
                    </div>
                )}

                {/* SECURITY SECTION */}
                {activeSection === 'security' && (
                    <div className="settings-pg-panel">
                        <div className="settings-pg-panel-header">
                            <h2><FaShieldAlt /> Security</h2>
                            <p>Update your password and security settings</p>
                        </div>

                        <form onSubmit={handlePasswordChange} className="settings-pg-form">
                            <div className="settings-pg-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="settings-pg-input"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>

                            <div className="settings-pg-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="settings-pg-input"
                                    placeholder="Min. 8 characters"
                                    required
                                />
                            </div>
                            <div className="settings-pg-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="settings-pg-input"
                                    placeholder="Repeat password"
                                    required
                                />
                            </div>

                            <button type="submit" className="settings-pg-btn" disabled={saving} style={{ background: '#ff3b30' }}>
                                <FaLock />
                                {saving ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ACCOUNT SECTION */}
                {activeSection === 'account' && (
                    <div className="settings-pg-panel">
                        <div className="settings-pg-panel-header">
                            <h2><FaUserCog /> Account Info</h2>
                            <p>Your service record details</p>
                        </div>

                        <div className="settings-pg-info-list">
                            <div className="settings-pg-info-row">
                                <span className="settings-pg-info-label">Member Since</span>
                                <span className="settings-pg-info-value">
                                    {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="settings-pg-info-row">
                                <span className="settings-pg-info-label">Arena Rank</span>
                                <span className="settings-pg-info-value" style={{ color: '#007aff' }}>Arena {user.arena || 1}</span>
                            </div>
                            <div className="settings-pg-info-row">
                                <span className="settings-pg-info-label">Total XP</span>
                                <span className="settings-pg-info-value">{user.xp?.toLocaleString() || 0} XP</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsTab;
