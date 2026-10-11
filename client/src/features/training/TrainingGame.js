import React, { useState, useEffect } from 'react';
import ResultPage from './ResultPage';
import './TrainingGame.css';

const TrainingGame = ({ module, onComplete, onExit }) => {
    const [currentNodeKey, setCurrentNodeKey] = useState(module.startNode || 'start');
    const [answers, setAnswers] = useState([]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [gameStatus, setGameStatus] = useState('playing');
    const [finalResults, setFinalResults] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // NEW: Timer & Progress State
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [progress, setProgress] = useState(0);

    const currentNode = module.nodes[currentNodeKey];

    // Timer Logic
    useEffect(() => {
        if (gameStatus !== 'playing') return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleGameEnd(0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameStatus]);

    // Progress Logic
    useEffect(() => {
        const newProgress = Math.min(100, Math.round((answers.length / 10) * 100));
        setProgress(newProgress);
    }, [answers]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleChoice = (option) => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        const points = option.points || 0;
        setAnswers(prev => [...prev, { points, maxPoints: Math.max(...currentNode.options.map(o => o.points || 0)) }]);

        setTimeout(() => {
            setIsTransitioning(false);
            const nextKey = option.next;
            const nextNode = module.nodes[nextKey];

            if (nextNode && nextNode.type === 'ending') {
                handleGameEnd(points);
            } else {
                setCurrentNodeKey(nextKey);
            }
        }, 500);
    };

    const handleGameEnd = (lastPoints) => {
        const allAnswers = [...answers, { points: lastPoints, maxPoints: Math.max(...currentNode.options.map(o => o.points || 0)) }];
        const totalScore = allAnswers.reduce((sum, a) => sum + a.points, 0);
        const maxScore = allAnswers.reduce((sum, a) => sum + a.maxPoints, 0);
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        const passed = percentage >= 60;

        setFinalResults({
            totalScore,
            maxScore,
            percentage,
            passed,
            questionsAnswered: allAnswers.length,
            xpEarned: passed ? module.xpReward : 0
        });
        setGameStatus('results');
    };

    if (gameStatus === 'results') {
        return (
            <ResultPage
                results={finalResults}
                module={module}
                onComplete={(score, success) => { setIsSubmitting(true); onComplete(score, success); }}
                onExit={onExit}
                isSubmitting={isSubmitting}
            />
        );
    }

    return (
        <div className="training-game-arena">
            {/* Background Layer (Framed Style) */}
            <div
                className="game-bg-layer"
                style={{ backgroundImage: "url('/images/bg-game-framed-v3.png')" }}
            ></div>

            {/* NEW: HUD for Timer & Progress */}
            <div className="game-hud-simple">
                <div className="timer-simple">
                    <span>TIME: {formatTime(timeLeft)}</span>
                </div>
                <div className="progress-simple">
                    <span>PROGRESS: {progress}%</span>
                    <div className="progress-bar-simple-track">
                        <div className="progress-bar-simple-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Question Zone */}
            <div className="threat-zone">
                <div className="threat-card">
                    <p className="threat-text">{currentNode?.text}</p>
                </div>
            </div>

            {/* Answer Zone */}
            <div className="response-zone">
                <div className="player-hand">
                    {currentNode?.options?.map((opt, idx) => (
                        <div key={idx} className="training-game-response-card-wrapper" style={{ animationDelay: `${idx * 0.15}s` }}>
                            <div
                                className={`response-card ${isTransitioning ? 'disabled' : ''}`}
                                onClick={() => handleChoice(opt)}
                            >
                                <div className="training-game-response-card-text-content">
                                    {opt.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainingGame;
