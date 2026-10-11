import React, { useState, useEffect } from 'react';
import { getScenarioById } from '../../data/ScenarioRegistry';
import GameplayInterface from '../../features/scenarios/GameplayInterface';
import GameResults from '../../features/scenarios/GameResults';
import MissionStart from '../../features/scenarios/MissionStart';

// Generic Wrapper for running ANY scenario inside CourseRunner
const ScenarioRunner = ({ phase, onComplete }) => {
    const [gameState, setGameState] = useState('loading'); // loading, intro, gameplay, results
    const [scenario, setScenario] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);
    const [currentNodeKey, setCurrentNodeKey] = useState(null);
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState([]);
    const [progress, setProgress] = useState(0);
    const [retryKey, setRetryKey] = useState(0);

    // Prevent double-clicks
    const [isProcessing, setIsProcessing] = useState(false);

    // Load Scenario Data
    useEffect(() => {
        if (phase && phase.scenarioId) {
            const data = getScenarioById(phase.scenarioId);
            if (data) {
                setScenario(data);

                // Default to first role (Analyst/Default)
                // For exams, there is usually only one role or 'analyst' is the main one.
                const roleKey = Object.keys(data.roles)[0];
                const role = data.roles[roleKey];
                setCurrentRole(role);
                setCurrentNodeKey(role.startNode);

                setGameState('intro');
            } else {
                console.error(`Scenario ID ${phase.scenarioId} not found.`);
            }
        }
    }, [phase]);

    const handleIntroComplete = () => {
        setGameState('gameplay');
    };

    const handleMakeChoice = (option) => {
        if (isProcessing) return;
        setIsProcessing(true);

        // Record History
        const currentNode = currentRole.nodes[currentNodeKey];
        const newHistoryItem = {
            problem: currentNode.text,
            choice: option.text,
            points: option.points || 0,
            timeTaken: 0
        };

        const newHistory = [...history, newHistoryItem];
        setHistory(newHistory);
        setScore(prev => prev + (option.points || 0));

        // Calculate Progress (Clamp to 100%)
        const totalSteps = scenario.totalSteps || 8;
        const prog = Math.min((newHistory.length / totalSteps) * 100, 100);
        setProgress(prog);

        // Move Next
        if (option.next) {
            const nextNode = currentRole.nodes[option.next];
            if (nextNode.type === 'ending') {
                handleFinish(nextNode, newHistory, score + (option.points || 0));
            } else {
                // Delay for effect
                setTimeout(() => {
                    setCurrentNodeKey(option.next);
                    setIsProcessing(false); // Unlock
                }, 500);
            }
        } else {
            setIsProcessing(false);
        }
    };

    const handleFinish = (endingNode, finalHistory, finalScore) => {
        setGameState('results');
        setIsProcessing(false);
    };

    const handleExit = () => {
        // Default Success Check: 60% or based on ending node
        const isSuccess = score >= (scenario.xp * 0.6) || score >= 600;
        if (onComplete) {
            onComplete(isSuccess, score);
        }
    };

    const handleRetry = () => {
        // FULL RESET
        setRetryKey(prev => prev + 1);
        setScore(0);
        setHistory([]);
        setProgress(0);
        setIsProcessing(false);

        // Hard Reset to ensure Q1
        // Fallback to 'q1_phishing' if currentRole.startNode fails, but prefer role data
        const startNode = currentRole?.startNode || 'q1_phishing';
        setCurrentNodeKey(startNode);

        setGameState('intro');
    };

    if (gameState === 'loading' || !scenario) {
        return <div style={{ color: '#00d4ff', padding: 50, textAlign: 'center' }}>INITIALIZING SCENARIO...</div>;
    }

    if (gameState === 'intro') {
        return (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <MissionStart
                    key={`intro-${retryKey}`}
                    scenario={scenario}
                    selectedRole={currentRole}
                    onAnimationComplete={handleIntroComplete}
                />
            </div>
        );
    }

    if (gameState === 'results') {
        const isSuccess = score >= 600; // Hardcoded fallback for now, or use logic from above

        return (
            <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 10 }}>
                <GameResults
                    success={isSuccess}
                    score={score}
                    time="10:00"
                    history={history}
                    scenarioTitle={scenario.title}
                    onRestart={handleRetry}
                    onExit={handleExit}
                    isExam={scenario.type === 'exam'}
                />
            </div>
        );
    }

    // Calculate Step Display (Clamp to Total)
    const currentStepNum = Math.min(history.length + 1, scenario.totalSteps || 8);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Background */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url('/images/scenario-darkest-pixel.png')`,
                backgroundSize: 'cover',
                zIndex: -1
            }} />

            <GameplayInterface
                key={`gameplay-${retryKey}`}
                scenario={scenario}
                role={currentRole}
                currentNode={currentRole.nodes[currentNodeKey]}
                handleMakeChoice={handleMakeChoice}
                currentScore={score}
                progress={progress}
                currentStep={currentStepNum}
                totalSteps={scenario.totalSteps}
                isJudgeVisible={false}
                onNextStep={() => { }}
            />
        </div>
    );
};

export default ScenarioRunner;
