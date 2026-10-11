import React, { useState } from 'react';
import { FaUserCircle, FaHashtag, FaMapMarkerAlt, FaDog, FaBirthdayCake, FaLock, FaUserSecret, FaList, FaRocket } from 'react-icons/fa';
import './Phase1Detective.css';

const Phase1Detective = ({ onComplete }) => {
    // Game States: 'playing', 'hacking', 'success', 'failure'
    const [gameState, setGameState] = useState('playing');
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [scanProgress, setScanProgress] = useState(0);

    const targetProfile = {
        name: "Sarah Jenkins",
        handle: "@sarah_j_23",
        bio: "📍 Seattle | 🎂 Est. 1990 | Mom to Max 🐶",
        posts: [
            { id: 1, text: "Can't believe [Max] is already 5 years old! Time flies. #dogmom", keyword: "Max", type: "Pet" },
            { id: 2, text: "Throwback to our wedding in [Hawaii]! Best trip ever.", keyword: "Hawaii", type: "Location" },
            { id: 3, text: "Finally moved into the [Dreambox] apartment at 221B!", keyword: "Dreambox", type: "Address" },
        ]
    };

    const toggleKeyword = (keyword) => {
        if (gameState !== 'playing') return;

        if (selectedKeywords.includes(keyword)) {
            setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
        } else {
            if (selectedKeywords.length < 3) {
                setSelectedKeywords([...selectedKeywords, keyword]);
            }
        }
    };

    const attemptHack = () => {
        setGameState('hacking');
        setTimeout(() => {
            // Simple logic: if they found "Max", it's a win for this demo
            if (selectedKeywords.includes('Max')) {
                setGameState('success');
                // Wait for animation frame then call complete
                setTimeout(() => {
                    if (onComplete) onComplete(true, 1000);
                }, 2000);
            } else {
                setGameState('failure');
            }
        }, 2000);
    };

    const resetGame = () => {
        setSelectedKeywords([]);
        setGameState('playing');
    };

    return (
        <div className="phase1-detective-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 50,
            overflowY: 'auto',
            paddingTop: '60px',
            background: 'var(--simulation-bg)',
            backgroundRepeat: 'repeat',
            backgroundSize: '512px 512px',
            backgroundAttachment: 'fixed',
        }}>
            {/* Header removed as per user request */}

            <div className="p1-game-area">

                {/* ------ FAKE SOCIAL PROFILE ------ */}
                <div className="p1-social-profile">
                    <div className="p1-profile-header">
                        <div className="p1-avatar"></div>
                        <div className="p1-user-info">
                            <h4 className="p1-username">{targetProfile.name}</h4>
                            <div className="p1-handle">{targetProfile.handle}</div>
                        </div>
                    </div>

                    <div className="p1-bio">
                        {targetProfile.bio}
                    </div>

                    <div className="p1-posts">
                        {targetProfile.posts.map(post => (
                            <div key={post.id} className="p1-post">
                                {post.text.split(/(\[.*?\])/).map((part, index) => {
                                    if (part.startsWith('[') && part.endsWith(']')) {
                                        const keyword = part.slice(1, -1);
                                        const isSelected = selectedKeywords.includes(keyword);
                                        return (
                                            <span
                                                key={index}
                                                className={`p1-highlightable ${isSelected ? 'selected' : ''}`}
                                                onClick={() => toggleKeyword(keyword)}
                                            >
                                                {keyword}
                                            </span>
                                        );
                                    }
                                    return part;
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ------ HACKER TERMINAL ------ */}
                <div className="p1-hacker-terminal">
                    <div className="p1-term-header">
                        <span>PWD_CRACKER_V1.0</span>
                        <span className={`p1-status ${gameState}`}>STATUS: {gameState === 'playing' ? 'IDLE' : gameState.toUpperCase()}</span>
                    </div>

                    <div className="p1-collected-info">
                        <div className="p1-term-label">// TARGET PARAMETERS</div>
                        {selectedKeywords.length === 0 && <div className="p1-term-placeholder">Waiting for input...</div>}
                        <div className="p1-badges-container">
                            {selectedKeywords.map(k => (
                                <span key={k} className="p1-info-badge">{k}</span>
                            ))}
                        </div>
                    </div>

                    <div className="p1-generation-area">
                        <div className="p1-term-label">// GENERATED COMBINATIONS</div>
                        <div className="p1-combinations">
                            {selectedKeywords.map(k => (
                                <div key={k} className="p1-combo-line">&gt; {k}123!</div>
                            ))}
                        </div>
                    </div>

                    <button
                        className="p1-hack-btn"
                        disabled={selectedKeywords.length === 0 || gameState !== 'playing'}
                        onClick={attemptHack}
                    >
                        {gameState === 'hacking' ? 'BRUTE FORCING...' : 'EXECUTE ATTACK'}
                    </button>
                </div>
            </div>

            {/* OVERLAYS */}
            {gameState === 'success' && (
                <div className="p1-result-overlay p1-success">
                    <FaLock className="p1-result-icon" />
                    <h2>ACCESS GRANTED</h2>
                    <p className="p1-result-msg">
                        You cracked the password: <strong>Max123!</strong>
                        <br />
                        Because Sarah posted her dog's name, her account is now yours.
                    </p>
                </div>
            )}

            {gameState === 'failure' && (
                <div className="p1-result-overlay p1-failure">
                    <FaLock className="p1-result-icon" />
                    <h2>ACCESS DENIED</h2>
                    <p>That information wasn't enough. Look for names, dates, or places.</p>
                    <button onClick={resetGame} className="p1-retry-btn">TRY AGAIN</button>
                </div>
            )}

        </div>
    );
};

export default Phase1Detective;
