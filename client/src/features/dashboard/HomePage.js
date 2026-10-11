import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // This imports the stylesheet.
import Typed from 'typed.js';

// >>> THIS IS THE CRUCIAL PART THAT WAS MISSING <<<
// Import all the images you need from your assets folder
import heroSentinelImg from '../../assets/resources/hero-sentinel.png';
import heroStrategistImg from '../../assets/resources/hero-strategist.png';
import heroArbiterImg from '../../assets/resources/hero-arbiter.png';
import timelineFrame1 from '../../assets/resources/timeline-frame-1.png';
import timelineFrame2 from '../../assets/resources/timeline-frame-2.png';
import timelineFrame3 from '../../assets/resources/timeline-frame-3.png';
import timelineFrame4 from '../../assets/resources/timeline-frame-4.png';


const HomePage = () => {

    useEffect(() => {

        class PixelParticleSystem {
            constructor() {
                this.canvas = document.getElementById('particle-canvas');
                if (!this.canvas) return;
                this.ctx = this.canvas.getContext('2d');
                this.particles = [];
                this.mouse = { x: 0, y: 0 };
                this.colors = ['#00FFFF', '#FF0080', '#B0FF00', '#9A00FF', '#FF5F1F'];
                this.resize();
                this.bindEvents();
                this.animate();
            }
            resize = () => { if (this.canvas) { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; } }
            bindEvents = () => { window.addEventListener('resize', this.resize); window.addEventListener('mousemove', this.handleMouseMove); window.addEventListener('click', this.handleClick); }
            handleMouseMove = (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; this.spawnParticles(e.clientX, e.clientY, 3); }
            handleClick = (e) => { this.spawnBlockBuildingEffect(e.clientX, e.clientY); }
            spawnParticles(x, y, count = 5) { for (let i = 0; i < count; i++) { this.particles.push({ x: x + (Math.random() - 0.5) * 50, y: y + (Math.random() - 0.5) * 50, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, size: Math.random() * 4 + 2, color: this.colors[Math.floor(Math.random() * this.colors.length)], life: 1, decay: Math.random() * 0.02 + 0.01 }); } }
            spawnBlockBuildingEffect(x, y) { for (let i = 0; i < 20; i++) { setTimeout(() => { this.particles.push({ x: x + (Math.random() - 0.5) * 100, y: window.innerHeight, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 5 - 2, size: 8, color: this.colors[i % this.colors.length], life: 1, decay: 0.005, isBlock: true }); }, i * 50); } }
            updateParticles() { for (let i = this.particles.length - 1; i >= 0; i--) { const p = this.particles[i]; p.x += p.vx; p.y += p.vy; p.life -= p.decay; if (p.isBlock) { p.vy += 0.1; } if (p.life <= 0) { this.particles.splice(i, 1); } } }
            renderParticles() { if (!this.ctx) return; this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); for (const p of this.particles) { this.ctx.save(); this.ctx.globalAlpha = p.life; this.ctx.fillStyle = p.color; if (p.isBlock) { this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size); this.ctx.strokeStyle = p.color; this.ctx.lineWidth = 1; this.ctx.strokeRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size); } else { this.ctx.shadowBlur = 10; this.ctx.shadowColor = p.color; this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size); } this.ctx.restore(); } }
            animationFrameId = null;
            animate = () => { this.updateParticles(); this.renderParticles(); this.animationFrameId = requestAnimationFrame(this.animate); }
            destroy() { window.removeEventListener('resize', this.resize); window.removeEventListener('mousemove', this.handleMouseMove); window.removeEventListener('click', this.handleClick); if (this.animationFrameId) { cancelAnimationFrame(this.animationFrameId); } }
        }
        class ScrollAnimations {
            observer;
            constructor() { this.observeElements(); }
            observeElements() { this.observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); } }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }); document.querySelectorAll('.timeline-item, .hero-card, .feature-card').forEach(el => { this.observer.observe(el); }); }
            destroy() { if (this.observer) { this.observer.disconnect(); } }
        }

        const typedInstance = new Typed('#typedText', { strings: ["Initializing...", "Loading threat matrix...", "Welcome to CyberGuard."], typeSpeed: 50, backSpeed: 30, backDelay: 2000, loop: true, cursorChar: '_' });
        const particleSystem = new PixelParticleSystem();
        const scrollAnimations = new ScrollAnimations();

        setTimeout(() => { const loadingScreen = document.getElementById('loadingScreen'); if (loadingScreen) { loadingScreen.classList.add('hidden'); setTimeout(() => { loadingScreen.style.display = 'none'; }, 500); } }, 100);

        return () => {
            typedInstance.destroy();
            particleSystem.destroy();
            scrollAnimations.destroy();
        };
    }, []);
    const [selectedStep, setSelectedStep] = useState(null);
    const navigate = useNavigate();

    const timelineSteps = [
        {
            id: 1,
            title: "Step 01: Choose Scenario",
            image: timelineFrame1,
            description: "Select from a library of hyper-realistic cyber threats, from phishing campaigns to full-blown network intrusions.",
            details: "You can choose simulations tailored for different experience levels — beginner, intermediate, and advanced. Each scenario tests specific cybersecurity skills such as detection, mitigation, and incident response."
        },
        {
            id: 2,
            title: "Step 02: Pick Your Role",
            image: timelineFrame2,
            description: "Assume the identity of a SOC Analyst, IT Admin, or even a non-technical employee.",
            details: "Each role presents unique challenges and perspectives. This helps players understand how different departments handle the same incident differently."
        },
        {
            id: 3,
            title: "Step 03: Make Decisions",
            image: timelineFrame3,
            description: "Navigate a branching decision tree that impacts security, budget, and reputation.",
            details: "Your actions will influence multiple outcomes, allowing you to learn risk-reward tradeoffs and real-time decision making in cyber crisis situations."
        },
        {
            id: 4,
            title: "Step 04: See The Outcome",
            image: timelineFrame4,
            description: "Receive instant feedback and leaderboard scores.",
            details: "Analyze your performance metrics, identify weaknesses, and track improvement over time. You can also challenge others to compete."
        }
    ];


    return (
        <>
            <div className="loading-screen" id="loadingScreen">
                <div className="loading-text">INITIALIZING CYBERGUARD...</div>
            </div>

            <canvas id="particle-canvas"></canvas>

            <section className="hero-section">
                <div className="hero-title-container">
                    <div className="hero-frame-bg"></div>
                    <h1 className="glitch-title" id="mainTitle">CYBERGUARD</h1>
                </div>
                <div className="hacker-text" id="typedText"></div>
            </section>

            {/* <=== REORDERED: Training Section Now Before Heroes ===> */}
            <section className="training-preview-section">
                <div className="section-header">
                    <h2 className="section-title">Elite Cyber Academy</h2>
                    <p className="section-subtitle">
                        Theoretical knowledge meets practical application. Our comprehensive training modules
                        guide you from foundational security concepts to advanced threat mitigation strategies.
                    </p>
                </div>

                <div className="training-features-container">
                    <div className="training-feature-block">
                        <div className="tf-content">
                            <h3>Structured Career Paths</h3>
                            <p>Don't just learn random skills. Follow curated paths designed by industry veterans to take you from Novice to Architect.</p>
                            <ul className="tf-list">
                                <li>Foundational Security</li>
                                <li>Network Defense</li>
                                <li>Incident Response</li>
                            </ul>
                        </div>
                        <div className="tf-visual pattern-grid"></div>
                    </div>

                    <div className="training-preview-grid">
                        <div className="training-preview-card">
                            <div className="card-icon">🛡️</div>
                            <h3>Phishing Defense</h3>
                            <p>Identify deceptive tactics and secure your human perimeter.</p>
                            <div className="card-badge">Module 01</div>
                        </div>
                        <div className="training-preview-card">
                            <div className="card-icon">🔐</div>
                            <h3>Password Mastery</h3>
                            <p>Entropy, MFA, and credential hygiene fundamentals.</p>
                            <div className="card-badge">Module 02</div>
                        </div>
                    </div>
                </div>

                <div className="section-cta-container">
                    <button className="apple-cta-button" onClick={() => navigate('/training')}>Explore Full Curriculum</button>
                </div>
            </section>

            <section className="heroes-section">
                <div className="section-header">
                    <h2 className="section-title">Meet The Guardians</h2>
                </div>
                <div className="heroes-grid">
                    <div className="hero-card" data-hero="sentinel">
                        <div className="hero-image-container">
                            <img src={heroSentinelImg} alt="The Sentinel" className="hero-image" />
                        </div>
                        <h3 className="hero-title">The Sentinel</h3>
                        <p className="hero-role">Warden of the Digital Realm</p>
                        <p className="hero-script">"I live in the data streams. In my simulation, you will hunt for the zero-day threat before it hunts you."</p>
                    </div>

                    <div className="hero-card" data-hero="strategist">
                        <div className="hero-image-container">
                            <img src={heroStrategistImg} alt="The Strategist" className="hero-image" />
                        </div>
                        <h3 className="hero-title">The Strategist</h3>
                        <p className="hero-role">Guardian of the Human Element</p>
                        <p className="hero-script">"The greatest vulnerability isn't in a server; it's a moment of human error. Prove you can protect our people."</p>
                    </div>

                    <div className="hero-card" data-hero="arbiter">
                        <div className="hero-image-container">
                            <img src={heroArbiterImg} alt="The Arbiter" className="hero-image" />
                        </div>
                        <h3 className="hero-title">The Arbiter</h3>
                        <p className="hero-role">The All-Seeing Eye</p>
                        <p className="hero-script">"I am the architect of this crucible. I don't care about intentions; I care about results. Prepare for evaluation."</p>
                    </div>
                </div>
            </section>

            <section className="timeline-section">
                <div className="section-header">
                    <h2 className="section-title">HOW TTX WORKS</h2>
                </div>
                <div className="timeline-container">
                    <div className="timeline-line"></div>

                    {timelineSteps.map((step, index) => (
                        <div
                            key={step.id}
                            className="timeline-item"
                            onClick={() => setSelectedStep(step)}
                        >
                            <div className="timeline-node">
                                <i className={`fas ${["fa-clipboard-list", "fa-user-secret", "fa-project-diagram", "fa-trophy"][index]} timeline-icon`}></i>
                            </div>
                            <div className="timeline-content">
                                <div className="timeline-frame" style={{ backgroundImage: `url(${step.image})` }}></div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Why CyberGuard?</h2>
                    <p className="section-subtitle">Built for the modern threat landscape.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card apple-card">
                        <div className="feature-icon-wrapper">
                            <span className="feature-icon">🎮</span>
                        </div>
                        <div className="feature-content">
                            <h3>Gamified Scenarios</h3>
                            <p>Immersive, high-stakes simulations that turn dry compliance training into an engaging wargame.</p>
                        </div>
                    </div>

                    <div className="feature-card apple-card">
                        <div className="feature-icon-wrapper">
                            <span className="feature-icon">⚡</span>
                        </div>
                        <div className="feature-content">
                            <h3>Instant Feedback</h3>
                            <p>Real-time analytics and performance metrics help you identify gaps and improve faster than ever.</p>
                        </div>
                    </div>

                    <div className="feature-card apple-card">
                        <div className="feature-icon-wrapper">
                            <span className="feature-icon">🏆</span>
                        </div>
                        <div className="feature-content">
                            <h3>Competitive Leagues</h3>
                            <p>Climb the global ranks. Compete with peers and prove your skills in seasonal tournaments.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* === CERTIFICATE VERIFICATION SECTION === */}
            <CertificateVerification />

            {
                selectedStep && (
                    <div className="modal-overlay" onClick={() => setSelectedStep(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setSelectedStep(null)}>×</button>
                            <img src={selectedStep.image} alt={selectedStep.title} className="modal-image" />
                            <h2 className="modal-title">{selectedStep.title}</h2>
                            <p className="modal-description">{selectedStep.details}</p>
                        </div>
                    </div>
                )
            }

        </>
    );
};

// Certificate Verification Component
const CertificateVerification = () => {
    const [certId, setCertId] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState(null);

    const handleVerify = async () => {
        if (!certId.trim()) return;

        setVerifying(true);
        setResult(null);

        const targetId = certId.trim().toUpperCase();

        try {
            // 1. Try Real API First
            const res = await fetch(`/api/certificates/verify/${targetId}`);
            if (res.ok) {
                const data = await res.json();
                setResult(data);
                setVerifying(false);
                return;
            }
            throw new Error("API not found or failed");
        } catch (err) {
            // 2. Fallback to Local Mock Blockchain (localStorage)
            try {
                const mockDb = JSON.parse(localStorage.getItem('mock_server_certs') || '{}');

                // Strategy A: Direct Key Lookup
                let localCert = mockDb[targetId];

                // Strategy B: Scan Values
                if (!localCert) {
                    localCert = Object.values(mockDb).find(cert => cert.certId === targetId);
                }

                if (localCert) {
                    setTimeout(() => {
                        setResult({
                            valid: true,
                            certificate: {
                                title: localCert.title,
                                recipientName: localCert.recipientName,
                                earnedAt: localCert.earnedAt,
                                issuer: "CyberGuard Academy",
                                id: localCert.certId
                                // REMOVED: Skills and other metadata to prevent info leakage
                            }
                        });
                        setVerifying(false);
                    }, 800);
                    return;
                } else {
                    setResult({ valid: false, msg: 'Certificate ID not valid or not found.' });
                }
            } catch (e) {
                setResult({ valid: false, msg: 'Verification unavailable.' });
            }
        }
        setVerifying(false);
    };

    return (
        <section className="verify-section">
            <div className="section-header">
                <h2 className="section-title">Verify Credentials</h2>
                <p className="section-subtitle">Official Academic Registry</p>
            </div>

            <div className="verify-container">
                <div className="verify-card-frame">
                    <p className="verify-description">
                        Enter the unique certificate identifier to validate its authenticity against the CyberGuard immutable ledger.
                    </p>

                    <div className="verify-input-group">
                        <input
                            type="text"
                            value={certId}
                            onChange={(e) => setCertId(e.target.value.toUpperCase())}
                            placeholder="XXX-XXXX-XXXX"
                            className="verify-input"
                            maxLength={20}
                            onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                        />
                        <button
                            onClick={handleVerify}
                            className="verify-button"
                            disabled={verifying || !certId.trim()}
                        >
                            {verifying ? 'CHECKING...' : 'VERIFY ID'}
                        </button>
                    </div>

                    {result && (
                        <div className={`verify-result fade-in ${result.valid ? 'valid' : 'invalid'}`}>
                            <button className="verify-close-btn" onClick={() => setResult(null)}>×</button>

                            {result.valid ? (
                                <div className="result-content-official">
                                    <div className="official-stamp">VERIFIED</div>
                                    <div className="result-header">
                                        <div className="status-indicator success"></div>
                                        <h3>VALID CREDENTIAL</h3>
                                    </div>

                                    <div className="result-grid">
                                        <div className="result-item">
                                            <span className="label">CERTIFICATE ID</span>
                                            <span className="value mono">{result.certificate.id}</span>
                                        </div>
                                        <div className="result-item">
                                            <span className="label">RECIPIENT</span>
                                            <span className="value">{result.certificate.recipientName}</span>
                                        </div>
                                        <div className="result-item full-width">
                                            <span className="label">QUALIFICATION</span>
                                            <span className="value highlight">{result.certificate.title}</span>
                                        </div>
                                        <div className="result-item">
                                            <span className="label">DATE ISSUED</span>
                                            <span className="value">{new Date(result.certificate.earnedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="result-item">
                                            <span className="label">ISSUER</span>
                                            <span className="value">{result.certificate.issuer}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="result-content-official">
                                    <div className="result-header">
                                        <div className="status-indicator error"></div>
                                        <h3>INVALID CREDENTIAL</h3>
                                    </div>
                                    <p className="error-msg">{result.msg}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HomePage;