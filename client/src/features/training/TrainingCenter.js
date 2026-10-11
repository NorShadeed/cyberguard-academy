import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../features/auth/AuthContext';
import './TrainingCenter.css';
import TrainingLobby from './TrainingLobby';
import TrainingDetail from './TrainingDetail';
import TrainingGame from './TrainingGame';
// import { COURSE_CATALOG } from '../../data/CourseCatalog';
import { getAllModules } from '../../data/ModuleRegistry';

// Use Registry
const COURSE_CATALOG = getAllModules();

const TrainingCenter = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [accessDenied, setAccessDenied] = useState(false);
    const [userProgress, setUserProgress] = useState({
        phase1: false,
        phase2: false,
        phase3: false
    });

    // Determine view from URL
    const getViewFromPath = () => {
        const path = location.pathname;
        if (path.includes('/training/game/')) return 'game';
        if (path.includes('/training/phase/')) return 'detail';
        return 'lobby';
    };

    const view = getViewFromPath();

    const fetchModules = async () => {
        try {
            const res = await fetch('/api/training');
            const data = await res.json();
            setModules(data);
        } catch (err) {
            console.error("Failed to fetch modules", err);
        }
    };

    const fetchUserProgress = useCallback(async () => {
        try {
            const res = await fetch('/api/user/profile', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            if (data.certificationStatus || data.completedScenarios) {
                // Merge legacy and new progress
                setUserProgress(prev => ({
                    ...prev,
                    ...data.certificationStatus,
                    completedScenarios: data.completedScenarios || []
                }));
            }
            return { ...data.certificationStatus, completedScenarios: data.completedScenarios || [] };
        } catch (err) {
            console.error("Failed to fetch user progress", err);
            return null;
        }
    }, [token]);

    useEffect(() => {
        fetchModules();
        fetchUserProgress();
    }, [fetchUserProgress]);

    // SECURITY: Validate phase access with backend before loading
    useEffect(() => {
        const validateAndLoadPhase = async () => {
            const path = location.pathname;
            const phaseMatch = path.match(/\/training\/(?:phase|game)\/(.+)/); // Match string ID too

            if (!phaseMatch) {
                setSelectedModule(null);
                setAccessDenied(false);
                return;
            }

            const phaseId = phaseMatch[1]; // Keep as string first

            // Wait for modules to load
            if (modules.length === 0) return;

            // Get fresh user progress
            const progress = await fetchUserProgress();
            if (!progress) {
                alert('Please log in to access training.');
                navigate('/auth');
                return;
            }

            // Unlocking Logic
            // We need to find the previous phase in the catalog
            let isAllowed = false;
            let previousPhaseId = null;

            // 1. Find the phase in the catalog
            for (const course of COURSE_CATALOG) {
                const pIndex = course.phases.findIndex(p => String(p.phaseId) === String(phaseId));
                if (pIndex !== -1) {
                    if (pIndex === 0) {
                        isAllowed = true; // First phase always unlocked
                    } else {
                        previousPhaseId = course.phases[pIndex - 1].phaseId;
                        const prevIsLegacyId = ['1', '2', '3'].includes(String(previousPhaseId));

                        if (!prevIsLegacyId) {
                            // Strict check for new string IDs
                            let completed = false;
                            if (progress.completedScenarios) {
                                const prevPhaseObj = course.phases[pIndex - 1];
                                completed = progress.completedScenarios.some(s =>
                                    s.scenarioId === String(previousPhaseId) ||
                                    (prevPhaseObj.scenarioId && s.scenarioId === String(prevPhaseObj.scenarioId))
                                );
                            }

                            // Legacy Fallback for 'security-awareness' course
                            if (!completed && course.id === 'security-awareness') {
                                completed = progress[`phase${pIndex}`]; // pIndex is 1-based index of PREV phase? No, pIndex is index of CURRENT phase. So prev phase is pIndex.
                                // Wait, pIndex is index in array (0, 1, 2). Phase numbers are usually pIndex + 1.
                                // The previous phase is index pIndex-1. Its phaseNumber should be pIndex.
                                // e.g. Current is Phase 2 (index 1). Prev is Phase 1 (index 0). phaseNumber 1.
                                if (!completed) completed = progress[`phase${course.phases[pIndex - 1].phaseNumber}`];
                            }

                            if (completed) isAllowed = true;
                        } else {
                            // Legacy check for old numeric IDs
                            if (progress[`phase${pIndex}`] || progress[previousPhaseId] /* fallback */) {
                                isAllowed = true;
                            }
                        }
                    }
                    break;
                }
            }

            // Fallback for legacy numeric IDs (1, 2, 3) if not found in catalog (or if URL used number)
            const pidNum = parseInt(phaseId);
            if (!isNaN(pidNum) && !isAllowed) {
                if (pidNum === 1) isAllowed = true;
                if (pidNum === 2 && progress.phase1) isAllowed = true;
                if (pidNum === 3 && progress.phase2) isAllowed = true;
            }

            if (!isAllowed) {
                setAccessDenied(true);
                setSelectedModule(null);
                alert(`⛔ ACCESS DENIED: Complete the previous phase first!`);
                navigate('/training');
                return;
            }

            // Phase is unlocked, load the module
            // We need to find the module data. simpler to find in catalog now?
            // Existing logic uses 'modules' state. Let's try to match string or int
            const mod = modules.find(m => String(m.phaseId) === String(phaseId));

            if (mod) {
                setAccessDenied(false);
                setSelectedModule(mod);
            } else {
                // If not in 'modules' (APIs), maybe try to construct from catalog? 
                // For now, if not in modules, redirect (maybe it's a new static module not in DB yet)
                // Actually, let's look in Catalog if not in modules API
                const catalogMod = (() => {
                    for (const c of COURSE_CATALOG) {
                        const p = c.phases.find(ph => String(ph.phaseId) === String(phaseId));
                        if (p) return p;
                    }
                })();

                if (catalogMod) {
                    setAccessDenied(false);
                    setSelectedModule(catalogMod);
                } else {
                    navigate('/training');
                }
            }
        };

        validateAndLoadPhase();
    }, [location.pathname, modules, fetchUserProgress, navigate]);

    const isPhaseUnlocked = (phaseId) => {
        // First phase always open
        if (phaseId === 1 || String(phaseId).startsWith('p1_')) return true;

        // Check catalog for predecessors
        for (const course of COURSE_CATALOG) {
            const pIndex = course.phases.findIndex(p => String(p.phaseId) === String(phaseId));
            if (pIndex !== -1) {
                if (pIndex === 0) return true;
                const prevId = course.phases[pIndex - 1].phaseId;

                // Legacy Check
                if (userProgress[prevId]) return true;

                // New Array Check
                if (userProgress.completedScenarios) {
                    const prevPhaseObj = course.phases[pIndex - 1];
                    return userProgress.completedScenarios.some(s =>
                        s.scenarioId === String(prevId) ||
                        (prevPhaseObj.scenarioId && s.scenarioId === String(prevPhaseObj.scenarioId))
                    );
                }
                return false;
            }
        }

        // Legacy Fallback
        if (Number(phaseId) === 2) return userProgress.phase1;
        if (Number(phaseId) === 3) return userProgress.phase2;

        return false;
    };

    const handleSelectModule = (module) => {
        if (!isPhaseUnlocked(module.phaseId)) {
            alert(`Complete Phase ${module.phaseId - 1} first!`);
            return;
        }
        setSelectedModule(module);
        navigate(`/training/phase/${module.phaseId}`);
    };

    const handleStartModule = () => {
        // Double-check before starting game
        if (!isPhaseUnlocked(selectedModule.phaseId)) {
            alert('⛔ ACCESS DENIED');
            navigate('/training');
            return;
        }
        navigate(`/training/game/${selectedModule.phaseId}`);
    };

    const handleBackToLobby = () => {
        setSelectedModule(null);
        navigate('/training');
    };

    const handleGameComplete = async (score, passed) => {
        console.log(`Submitting game results: Score=${score}, Passed=${passed}`);
        try {
            const res = await fetch('/api/training/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    phaseId: selectedModule.phaseId,
                    score: score,
                    passed: passed
                })
            });

            // SECURITY: Handle 403 Forbidden
            if (res.status === 403) {
                const error = await res.json();
                alert(`⛔ ${error.msg}`);
                navigate('/training');
                return;
            }

            if (!res.ok) {
                throw new Error('Server response was not ok');
            }

            const result = await res.json();
            console.log("Verification result:", result);

            if (result.passed) {
                if (result.certificationStatus) {
                    setUserProgress(result.certificationStatus);
                } else {
                    await fetchUserProgress();
                }
                handleBackToLobby();
            }
        } catch (err) {
            console.error("Submission failed", err);
            if (passed) handleBackToLobby();
        }
    };

    const handleResetProgress = async () => {
        if (!window.confirm("Are you sure you want to RESET all certification progress? This cannot be undone.")) return;

        try {
            const res = await fetch('/api/user/reset-progress', {
                method: 'POST',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                await fetchUserProgress();
                alert("Progress has been reset.");
            }
        } catch (err) {
            console.error("Reset failed", err);
        }
    };

    // Don't render if access denied (will redirect)
    if (accessDenied) {
        return <div className="training-center">Access Denied. Redirecting...</div>;
    }

    return (
        <div className="training-center">
            {view === 'lobby' && (
                <TrainingLobby
                    modules={modules}
                    onSelectModule={handleSelectModule}
                    userProgress={userProgress}
                    isPhaseUnlocked={isPhaseUnlocked}
                />
            )}

            {view === 'detail' && selectedModule && (
                <TrainingDetail
                    module={selectedModule}
                    onStart={handleStartModule}
                    onBack={handleBackToLobby}
                    isCompleted={
                        // Calculate completion using same logic as Lobby
                        userProgress.completedScenarios && userProgress.completedScenarios.some(s =>
                            s.scenarioId === String(selectedModule.phaseId) ||
                            (selectedModule.scenarioId && s.scenarioId === String(selectedModule.scenarioId))
                        ) ||
                        // Legacy fallback
                        (['1', '2', '3'].includes(String(selectedModule.phaseId)) && userProgress[`phase${selectedModule.phaseNumber}`])
                    }
                />
            )}

            {view === 'game' && selectedModule && (
                <TrainingGame
                    module={selectedModule}
                    onComplete={handleGameComplete}
                    onExit={handleBackToLobby}
                />
            )}
        </div>
    );
};

export default TrainingCenter;
