import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { getAllModules } from '../../data/ModuleRegistry';

// 1. Create the context itself
export const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
    // State to hold the authentication token
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch user data
    const loadUser = async (currentToken) => {
        if (!currentToken) {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get('/api/user/profile', {
                headers: { 'x-auth-token': currentToken }
            });

            setUser(res.data);
        } catch (err) {
            // Only clear token if unauthorized
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                console.warn('Token expired or invalid');
                localStorage.removeItem('token');
                setToken(null);
                setIsAuthenticated(false);
                setUser(null);
            } else if (err.response) {
                console.error('Failed to load user: Server error', err.response.status);
                // Do not log out on 500 or other errors
            } else {
                console.error("Failed to load user: Network error", err.message);
                // Do not log out on network error
            }
        } finally {
            setLoading(false);
        }
    };

    // This effect runs when the app loads to check if a token already exists
    useEffect(() => {
        loadUser(token);
    }, [token]);

    // The function to call when a user successfully logs in
    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
        // loadUser will be triggered by the useEffect on token change
    };

    // The function to call when a user logs out
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
    };

    // --- GAMIFICATION STATE (Local Simulation for Phase 1) ---
    const [gamification, setGamification] = useState(() => {
        const saved = localStorage.getItem('user_gamification');
        return saved ? JSON.parse(saved) : {
            xp: 1250,
            level: 3,
            rank: 'Cyber Cadet',
            streak: 1,
            completedNodes: [] // IDs of completed path nodes
        };
    });

    useEffect(() => {
        localStorage.setItem('user_gamification', JSON.stringify(gamification));
    }, [gamification]);

    // --- SYNC BACKEND PROGRESS TO GAMIFICATION ---
    useEffect(() => {
        if (user) {
            // Use server-side stats as the source of truth
            const serverXP = user.xp || 0;
            const serverStreak = user.loginStreak || 1;
            const serverLevel = user.level || 1;

            // Calculate Rank based on XP (Server logic mirror)
            let newRank = 'Cyber Cadet';
            if (serverXP > 5000) newRank = 'Cyber Operator';
            if (serverXP > 15000) newRank = 'Cyber Sentinel';

            // Map completed nodes for UI unlocks
            const completedIDs = [];
            const allModules = getAllModules();

            // Helper to check phase completion (Visuals only now)
            const checkPhaseCompletion = (phase) => {
                // 1. Check Completed Scenarios
                if (user.completedScenarios && user.completedScenarios.some(s => s.scenarioId === String(phase.phaseId) || (phase.scenarioId && s.scenarioId === String(phase.scenarioId)))) {
                    return true;
                }
                // 2. Check Legacy Certification Status
                if (user.certificationStatus) {
                    const legacyKey = `phase${phase.phaseNumber}`;
                    if (user.certificationStatus[legacyKey]) {
                        return true;
                    }
                }
                return false;
            };

            // Iterate all content to find what's done for UI UNLOCKS only
            allModules.forEach(course => {
                let allPhasesComplete = true;
                let finalExamPassed = false;

                if (course.phases && course.phases.length > 0) {
                    course.phases.forEach(phase => {
                        const isPhaseComplete = checkPhaseCompletion(phase);

                        if (isPhaseComplete) {
                            completedIDs.push(phase.phaseId);
                            if (phase.scenarioId) completedIDs.push(phase.scenarioId);

                            // Check if this is an Exam and it's passed
                            // We assume any scenario with 'exam' in ID or title, or explicit type 'exam' (if added) is the key
                            if (String(phase.phaseId).includes('exam') || (phase.title && phase.title.toLowerCase().includes('exam'))) {
                                finalExamPassed = true;
                            }
                        } else {
                            allPhasesComplete = false;
                        }
                    });
                } else {
                    allPhasesComplete = false;
                }

                // Rule: If ALL phases are done OR just the Final Exam is done -> Course Complete
                if (allPhasesComplete || finalExamPassed) {
                    completedIDs.push(course.id);
                }
            });

            setGamification(prev => {
                const combined = [...prev.completedNodes, ...completedIDs];
                const unique = [...new Set(combined)];

                // Only update if changed
                if (
                    unique.length !== prev.completedNodes.length ||
                    serverXP !== prev.xp ||
                    serverStreak !== prev.streak
                ) {
                    console.log("Syncing Profile -> Gamification | XP:", serverXP, "Streak:", serverStreak);
                    return {
                        ...prev,
                        completedNodes: unique,
                        xp: serverXP,
                        level: serverLevel,
                        rank: newRank,
                        streak: serverStreak
                    };
                }
                return prev;
            });
        }
    }, [user]);

    const addXp = (amount) => {
        setGamification(prev => {
            const newXp = prev.xp + amount;
            // Simple Level Algorithm: Level = sqrt(XP) * 0.1 (approx)
            // Or simple thresholds: Lvl 1=0, Lvl 2=1000, Lvl 3=2500...
            let newLevel = prev.level;

            // Re-calc rank based on level
            let newRank = prev.rank;
            if (newXp > 5000 && prev.rank === 'Cyber Cadet') newRank = 'Cyber Operator';
            if (newXp > 15000 && prev.rank === 'Cyber Operator') newRank = 'Cyber Sentinel';

            return { ...prev, xp: newXp, level: newLevel, rank: newRank };
        });
    };

    const completeNode = (nodeId) => {
        setGamification(prev => {
            if (prev.completedNodes.includes(nodeId)) return prev;
            return { ...prev, completedNodes: [...prev.completedNodes, nodeId] };
        });
    };

    // This is the data that will be available to all other components
    const value = {
        token,
        isAuthenticated,
        user,
        gamification, // Expose gamification state
        addXp,        // Expose helper
        completeNode, // Expose helper
        loading,
        login,
        logout,
        refreshUser: () => loadUser(token) // Allow components to manually refresh user data
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};