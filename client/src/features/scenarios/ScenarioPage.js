import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { AuthContext } from '../../features/auth/AuthContext';
import { useProgress } from '../../hooks/useProgress';

import './ScenarioPage.css';
import './ScenarioPageLoading.css';

// === MODULAR COMPONENTS ===
import ScenarioLobby from './ScenarioLobby';
import RoleSelection from './RoleSelection';
import GameResults from './GameResults';
import ScenarioDetail from './ScenarioDetail';
import MissionStart from './MissionStart';
import GameplayInterface from './GameplayInterface';

// === DATA REGISTRY (The Brain) ===
import { getScenarioById, getAllScenarios } from '../../data/ScenarioRegistry';
import { API_URL } from '../../config';

const ScenarioPage = () => {
    // --- STATE MANAGEMENT ---
    const { token, isAuthenticated, user, completeNode, addXp } = useContext(AuthContext);
    const [scenariosData, setScenariosData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [gameState, setGameState] = useState('lobby'); // lobby, details, role_select, mission_start, gameplay, results
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [currentNodeKey, setCurrentNodeKey] = useState(null);
    const [currentScore, setCurrentScore] = useState(0);
    const [playedCards, setPlayedCards] = useState([]);
    const [choiceHistory, setChoiceHistory] = useState([]);
    const [isJudgeVisible, setIsJudgeVisible] = useState(false);
    const [judgeMessage, setJudgeMessage] = useState(null);
    const [nextMove, setNextMove] = useState(null);
    const [isCardPlaying, setIsCardPlaying] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [questionTime, setQuestionTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [gameOutcome, setGameOutcome] = useState({ success: false, score: 0 });

    const [userProgress, setUserProgress] = useState({});

    // Prevent double-click race conditions
    const interactionLock = React.useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const location = useLocation();

    // --- INITIAL LOAD ---
    useEffect(() => {
        const init = async () => {
            // 1. Get All Scenarios from Registry
            const allScenarios = getAllScenarios();
            setScenariosData(allScenarios);

            // 2. Fetch User Progress
            if (isAuthenticated) {
                try {
                    const res = await fetch('/api/user/profile', { headers: { 'x-auth-token': token } });
                    const pData = await res.json();
                    setUserProgress({
                        ...pData.certificationStatus,
                        completedScenarios: pData.completedScenarios || []
                    });
                } catch (err) {
                    console.error("Failed to fetch user progress locally", err);
                }
            }
            setLoading(false);
        };
        init();
    }, [isAuthenticated, token]);

    // --- MERGE PROGRESS WITH SCENARIOS ---
    const mergedScenarios = React.useMemo(() => {
        if (!scenariosData || scenariosData.length === 0) return [];

        return scenariosData.map(scenario => {
            // Check if this scenario ID exists in user's completed list
            // userProgress.completedScenarios is expected to be an array of objects { scenarioId: "..." }
            const isCompleted = userProgress.completedScenarios?.some(
                cs => cs.scenarioId === scenario.id
            );

            return {
                ...scenario,
                completed: !!isCompleted // Force boolean
            };
        });
    }, [scenariosData, userProgress]);


    // --- AUTO-LAUNCH HANDLER (From CourseCatalog) ---
    useEffect(() => {
        if (location.state?.autoLaunchId && !selectedScenario && !loading) {
            console.log("Auto-launching scenario:", location.state.autoLaunchId);
            const targetId = location.state.autoLaunchId;
            const targetScenario = getScenarioById(targetId);

            if (targetScenario) {
                handleSelectScenario(targetScenario);
            } else {
                console.warn(`Scenario ID ${targetId} not found in Registry.`);
            }
        }
    }, [location.state, loading]);


    // --- GAMEPLAY TIMER ---
    useEffect(() => {
        if (gameState === 'gameplay') {
            const timer = setInterval(() => {
                setTotalTime(t => t + 1);
                setQuestionTime(t => t + 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameState]);


    // --- ACTIONS ---

    const handleSelectScenario = (scenario) => {
        // Ensure we store the simplified "data object" not just the summary
        // The registry returns the full object, so we are good.
        console.log("Selected Scenario:", scenario.title);

        setSelectedScenario(scenario);

        // Auto-start for Exams if they have a forced single role
        // (Logic taken from previous version but made generic)
        if (scenario.type === 'exam' && scenario.roles) {
            const roleKeys = Object.keys(scenario.roles);
            if (roleKeys.length > 0) {
                // Default to first role (usually 'analyst' for exams)
                const defaultRoleKey = roleKeys[0];
                const defaultRole = scenario.roles[defaultRoleKey];

                setSelectedRole(defaultRole);
                setCurrentNodeKey(defaultRole.startNode);
                setGameState('details');
                return;
            }
        }

        setGameState('details');
    };

    const handleStartScenario = () => {
        // If role is already pre-selected (Exam mode), skip role select
        if (selectedScenario.type === 'exam' && selectedRole) {
            // Reset stats
            setTotalTime(0);
            setQuestionTime(0);
            setProgress(0);
            setChoiceHistory([]);
            setCurrentScore(0);

            // CRITICAL FIX: Reset Node to Start!
            if (selectedRole.startNode) {
                setCurrentNodeKey(selectedRole.startNode);
            }

            setGameState('mission_start');
        } else {
            setGameState('role_select');
        }
    };

    const handleBackToLobby = () => {
        setGameState('lobby');
        setSelectedScenario(null);
        setSelectedRole(null);
    };

    const handleSelectRole = (role) => {
        setTotalTime(0);
        setQuestionTime(0);
        setProgress(0);
        setChoiceHistory([]);
        setCurrentScore(0);

        // Access roles from the Map/Object structure
        // Fallback for different data structures if necessary
        const roleData = selectedScenario.roles[role.id] || role;

        setCurrentNodeKey(roleData.startNode);
        setSelectedRole(roleData);
        setGameState('mission_start');
    };

    const handleMissionStartComplete = () => { setGameState('gameplay'); };

    const handleNextStep = (explicitNextKey = null, overrideScore = null, overrideHistory = null) => {
        console.log('[handleNextStep] START', { explicitNextKey, overrideScore, overrideHistory });

        setIsJudgeVisible(false);
        setIsCardPlaying(false);

        // Remove 'playing' class if any
        const allCards = document.querySelectorAll('.response-card');
        allCards.forEach(c => c.classList.remove('playing'));

        // Use explicit key if provided (for Exams), otherwise use state (for Judge flow)
        const nextNodeId = explicitNextKey || (nextMove && nextMove.nextNodeKey);
        console.log('[handleNextStep] nextNodeId determined:', nextNodeId);
        console.log('[handleNextStep] nextMove state:', nextMove);

        if (nextNodeId) {
            const currentNodes = selectedRole.nodes;
            const nextNode = currentNodes[nextNodeId];

            console.log('[handleNextStep] Looking for node:', nextNodeId);
            console.log('[handleNextStep] Available nodes:', Object.keys(currentNodes));
            console.log('[handleNextStep] Found nextNode:', nextNode);

            // Check if nextNode exists before accessing its properties
            if (!nextNode) {
                console.error(`[Navigation Error] Node "${nextNodeId}" not found in scenario "${selectedScenario.title}". Available nodes:`, Object.keys(currentNodes));
                console.error('This indicates invalid scenario data. Returning to lobby.');
                handleBackToLobby();
                return;
            }

            if (nextNode.type === 'ending') {
                console.log('[handleNextStep] Navigating to ENDING node');
                handleGameEnd(nextNode, overrideScore, overrideHistory);
            } else {
                console.log('[handleNextStep] Navigating to regular node:', nextNodeId);
                setCurrentNodeKey(nextNodeId);
            }
        } else {
            console.warn('[handleNextStep] No nextNodeId available. Staying on current node.');
        }
    };

    const handleMakeChoice = (option) => {
        console.log('[handleMakeChoice] CALLED with option:', option);

        if (isCardPlaying || isSubmitting) {
            console.log('[handleMakeChoice] BLOCKED - isCardPlaying or isSubmitting');
            return;
        }

        // === DEFENSIVE ERROR CHECKS (Softened) ===
        if (!option) {
            console.error('[handleMakeChoice] Error: option is null or undefined');
            return;
        }

        if (typeof option !== 'object') {
            console.error('[handleMakeChoice] Error: option is not an object:', option);
            return;
        }

        if (!option.text) {
            console.error('[handleMakeChoice] Error: option.text is missing:', option);
            return;
        }

        // Soft checks with defaults
        if (option.points === undefined || option.points === null) {
            console.warn('[handleMakeChoice] Warning: option.points is undefined, defaulting to 0');
            option.points = 0;
        }

        if (!option.next) {
            console.warn('[handleMakeChoice] Warning: option.next is missing. Attempting to continue anyway.', option);
            // Don't return - let it fail naturally if needed
        }

        if (!option.judge) {
            console.warn('[handleMakeChoice] Warning: option.judge is missing, using default message');
            option.judge = 'Your choice has been recorded.';
        }

        console.log('[handleMakeChoice] Validation passed. Processing choice...');
        console.log('[handleMakeChoice] option.next:', option.next);

        // --- FIX: RACE CONDITION & BOUNDARY CHECK ---
        if (interactionLock.current) return;

        const totalSteps = selectedScenario.totalSteps || 5;
        // Strictly prevent going past the limit
        if (choiceHistory.length >= totalSteps) {
            console.warn("Attempted to exceed total steps. Ignoring input.");
            return;
        }

        interactionLock.current = true;
        // Release lock after a short safety delay (debounce)
        setTimeout(() => { interactionLock.current = false; }, 500);

        setIsCardPlaying(true);

        const currentNodes = selectedRole.nodes;
        const problemText = currentNodes[currentNodeKey].text;

        const choice = option;

        // Calculate new state locally to avoid closure staleness in timeouts
        const newHistoryItem = {
            problem: problemText,
            choice: choice.text,
            points: choice.points || 0,
            timeTaken: questionTime
        };
        const newHistory = [...choiceHistory, newHistoryItem];
        const newScore = currentScore + (choice.points || 0);

        setChoiceHistory(prev => [...prev, newHistoryItem]);
        setQuestionTime(0);

        // Safety check for totalSteps
        // Clamp progress to 100%
        const prog = Math.min(((newHistory.length) / totalSteps) * 100, 100);
        setProgress(prog);

        setCurrentScore(prev => prev + (choice.points || 0));

        console.log('[handleMakeChoice] About to navigate. choice.next value:', choice.next);
        console.log('[handleMakeChoice] choice.next type:', typeof choice.next);
        console.log('[handleMakeChoice] Full choice object:', choice);

        // SAFETY FIX: If choice.next is an object, try to extract the string
        let nextNodeId = choice.next;
        if (typeof nextNodeId === 'object' && nextNodeId !== null) {
            console.error('[handleMakeChoice] ERROR: choice.next is an object!', nextNodeId);
            // Try to extract if it has a 'next' property
            if (nextNodeId.next && typeof nextNodeId.next === 'string') {
                console.log('[handleMakeChoice] Extracting nested next property:', nextNodeId.next);
                nextNodeId = nextNodeId.next;
            } else {
                console.error('[handleMakeChoice] Cannot extract string from object. Navigation will fail.');
            }
        }

        if (selectedScenario.type === 'exam') {
            // EXAM MODE: Skip Judge Feedback
            setTimeout(() => {
                console.log('[handleMakeChoice] EXAM mode - calling handleNextStep with:', nextNodeId);
                handleNextStep(nextNodeId, newScore, newHistory);
            }, 800);
        } else {
            // NORMAL MODE: Show Judge
            setJudgeMessage({ text: choice.judge, avatar: '/images/hero-arbiter.png' });

            // Store next move for the judge "Continue" button which calls handleNextStep() without args
            console.log('[handleMakeChoice] NORMAL mode - storing nextMove:', nextNodeId);
            setNextMove({ nextNodeKey: nextNodeId }); // Ensure we save where to go

            setTimeout(() => {
                setIsJudgeVisible(true);
            }, 1000);
        }
    };

    const handleGameEnd = async (endingNode, overrideScore = null, overrideHistory = null) => {
        if (isSubmitting) return; // Prevent duplicate submissions
        setIsSubmitting(true);

        try {
            let isSuccess = false;

            // Use overridden values if provided (prevents stale closure issues)
            const finalScoreToCheck = overrideScore !== null ? overrideScore : (endingNode.score !== undefined ? endingNode.score : currentScore);
            const finalHistory = overrideHistory !== null ? overrideHistory : choiceHistory;

            // Logic to determine success/fail
            if (endingNode.outcome === 'success') {
                isSuccess = true;
            } else if (endingNode.outcome === 'calculated' || selectedScenario.type === 'exam') {
                isSuccess = finalScoreToCheck >= 600;
            } else if (endingNode.text && (endingNode.text.includes('SUCCESS') || endingNode.text.includes('PASSED'))) {
                isSuccess = true;
            } else if (endingNode.score && endingNode.score >= 60) {
                isSuccess = true;
            }

            const finalScore = endingNode.score !== undefined ? endingNode.score : finalScoreToCheck;

            setGameOutcome({
                success: isSuccess,
                score: finalScore
            });

            // Send to Backend
            let persistenceSuccess = false;

            if (isAuthenticated && user) {
                // Calculate Stats
                const questionsCount = finalHistory.length;
                const correctCount = finalHistory.filter(h => (h.points || 0) > 0).length;

                try {
                    console.log("[Persistence] Saving scenario progress...", selectedScenario.id);
                    const response = await fetch(`${API_URL}/api/scenarios/complete`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        },
                        body: JSON.stringify({
                            userId: user._id || user.id, // Send actual User ID
                            scenarioId: selectedScenario.id,
                            score: finalScore,
                            questionsCount,
                            correctCount
                        })
                    });

                    if (response.ok) {
                        console.log("[Persistence] Save successful.");
                        persistenceSuccess = true;
                    } else {
                        console.error("[Persistence] Failed to save:", await response.text());
                        setSaveError("Failed to save progress. Your score is recorded locally.");
                        setTimeout(() => setSaveError(null), 5000);
                    }
                } catch (err) {
                    console.error("[Persistence] Network error while saving:", err);
                    setSaveError("Network error. Please check your connection and try again.");
                    setTimeout(() => setSaveError(null), 5000);
                }
            }

            // Update Local State Immediately (Only if success and ideally if saved, but we allow local optimistic update if needed)
            // However, user complained about it NOT saving. So let's prioritze the persistence flag if we want to be strict,
            // or just keep optimistic but log errors.
            // We will keep optimistic update for UX, but the logging above will help debug backend failures.
            // Also ensure we don't overwrite existing progress if it was already true.

            if (isSuccess) {
                // GLOBAL SYNC: Update AuthContext for Career Path
                if (completeNode) completeNode(selectedScenario.id);
                if (addXp) addXp(selectedScenario.xpReward || 1000);

                setUserProgress(prev => {
                    const alreadyCompleted = prev.completedScenarios?.some(cs => cs.scenarioId === selectedScenario.id);
                    if (alreadyCompleted) return prev;

                    return {
                        ...prev,
                        completedScenarios: [
                            ...(prev.completedScenarios || []),
                            { scenarioId: selectedScenario.id, timestamp: new Date() }
                        ]
                    };
                });
            }

            setGameState('results');
        } finally {
            setIsSubmitting(false);
        }
    };


    // --- PARTICLES ---
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    const particlesOptions = React.useMemo(() => ({
        background: { color: { value: "#000000" } },
        fpsLimit: 60, // Optimized
        interactivity: { events: { onClick: { enable: false }, onHover: { enable: true, mode: "repulse" }, resize: true } },
        particles: { color: { value: "#00ffff" }, links: { color: "#00ffff", distance: 150, enable: true, opacity: 0.5, width: 1 }, move: { enable: true, speed: 1.5 }, number: { value: 60 }, opacity: { value: 0.5 }, shape: { type: "circle" }, size: { value: { min: 1, max: 5 } } },
        detectRetina: true,
    }), []);

    if (loading) {
        return (
            <div className="scenario-page-loading">
                <div className="loading-text">ACCESSING MAINFRAME...</div>
            </div>
        );
    }

    return (
        <div className="scenario-page">
            <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />

            {/* Error Notification */}
            {saveError && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: '8px',
                    zIndex: 10000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    animation: 'slideDown 0.3s ease-out'
                }}>
                    ⚠️ {saveError}
                </div>
            )}

            {gameState === 'lobby' && (
                <ScenarioLobby
                    scenarios={mergedScenarios}
                    onSelect={handleSelectScenario}
                    userProgress={userProgress}
                />
            )}

            {gameState === 'details' && selectedScenario && (
                <ScenarioDetail
                    scenario={selectedScenario}
                    onStart={handleStartScenario}
                    onBack={handleBackToLobby}
                />
            )}

            {gameState === 'role_select' && selectedScenario && (
                <RoleSelection
                    roles={Object.values(selectedScenario.roles || {}).map(r => ({
                        ...r,
                        name: r.title,
                        desc: r.description,
                        avatar: r.avatar || '/images/hero-arbiter.png'
                    }))}
                    onSelectRole={handleSelectRole}
                    onBack={() => setGameState('details')}
                />
            )}

            {gameState === 'mission_start' && selectedRole && (
                <MissionStart
                    scenario={selectedScenario}
                    selectedRole={selectedRole}
                    onAnimationComplete={handleMissionStartComplete}
                />
            )}



            {gameState === 'gameplay' && selectedScenario && selectedRole && (
                <GameplayInterface
                    scenario={selectedScenario}
                    role={selectedRole}
                    currentNode={selectedRole.nodes[currentNodeKey]}
                    handleMakeChoice={handleMakeChoice}
                    onNextStep={handleNextStep}
                    isCardPlaying={isCardPlaying}
                    playedCards={playedCards}
                    selectedRole={selectedRole}
                    currentScore={currentScore}
                    progress={progress}
                    totalTime={totalTime}
                    isJudgeVisible={isJudgeVisible}
                    judgeMessage={judgeMessage}
                    currentStep={Math.min(choiceHistory.length + 1, selectedScenario.totalSteps || 5)}
                    totalSteps={selectedScenario.totalSteps || 5}
                />
            )}

            {gameState === 'results' && (
                <GameResults
                    success={gameOutcome.success}
                    score={gameOutcome.score}
                    time={totalTime}
                    totalQuestions={choiceHistory.length}
                    history={choiceHistory}
                    onRestart={handleStartScenario} /* Retry Action */
                    onExit={handleBackToLobby}      /* Exit Action */
                    scenarioTitle={selectedScenario.title}
                    isExam={selectedScenario.type === 'exam'}
                />
            )}
        </div >
    );
};

export default ScenarioPage;