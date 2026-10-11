import React from 'react';
import {
    FaShieldAlt, FaUserSecret, FaBug, FaNetworkWired, FaMobileAlt,
    FaFingerprint, FaKey, FaLock, FaExclamationTriangle, FaSearch,
    FaUserGraduate, FaBrain, FaBiohazard, FaMask, FaGlobe, FaWifi,
    FaEye, FaLaptopCode, FaExpandArrowsAlt, FaBomb, FaBriefcase, FaCheckCircle,
    FaMicrophoneAlt, FaWaveSquare, FaHeadset, FaPhoneSlash, FaFileAlt, FaFilePdf, FaRocket,
    FaCalendarAlt, FaPhone // Added for new lessons
} from 'react-icons/fa';
import { getScenarioById } from '../ScenarioRegistry';
import { ConceptCard, FactBox, HeroSection } from '../../features/training/components/TrainingUI';
import '../../features/training/styles/PhishingDefense.css'; // Keep for custom interactive elements

// Helper to sync with Scenario Registry
const syncScenario = (id, fallback) => {
    const source = getScenarioById(id);
    if (!source) return fallback;
    return {
        ...fallback,
        title: source.title || fallback.title,
        xpReward: source.xp || source.xpReward || fallback.xpReward,
        duration: source.time || source.duration || fallback.duration,
        difficulty: source.difficulty || fallback.difficulty
    };
};

const PhishingDefense = {
    id: 'phishing-defense',
    title: 'Advanced Phishing Defense',
    category: 'Advanced Defense',
    icon: <FaUserSecret />,
    color: '#ff4757', // Aggressive red/pink for advanced threat
    image: '/images/course-phishing-pixel.png',
    description: 'Go beyond "bad grammar" emails. Learn to defeat AiTM proxies, Deepfakes, and sophisticated Business Email Compromise.',
    businessValue: 'Stop the top vector for ransomware and data breaches. Defend against attacks that bypass MFA.',
    targetAudience: 'High-Value Targets (Executives, Finance, Admin)',
    certificateName: 'Phishing Hunter Badge',

    outcomes: [
        'Detect Homograph attacks and hidden unicodes',
        'Identify AiTM (Adversary-in-the-Middle) proxy attacks',
        'Recognize Deepfake audio and video cues',
        'Defend against OAuth Consent Phishing',
        'Execute Out-of-Band verification protocols'
    ],

    roi: {
        riskReduction: '95%',
        avgIncidentCost: '$5.1M',
        timeToValue: 'Immediate',
        complianceStandards: ['NIST 800-53', 'ISO 27001', 'SOC 2 Type II']
    },

    phases: [
        // =========================================================================
        // MODULE 1: The Illusion of Trust (Deception Techniques)
        // =========================================================================
        {
            phaseId: 'p1_illusion_trust',
            phaseNumber: 1,
            title: 'The Illusion of Trust',
            type: 'learning',
            duration: '20 min',
            difficulty: 'Intermediate',
            xpReward: 600,
            description: 'Deception Techniques: How attackers manipulate your eyes and your brain.',
            topics: ['BEC', 'Homograph Attacks', 'Subdomain Hijacking', 'Deepfakes'],
            icon: <FaMask />,
            professor: {
                name: "DR. MIRAGE",
                title: "Cognitive Security Expert // Rank: Phantom",
                avatarIcon: <FaBrain />
            },
            lessons: [
                // -----------------------------------------------------------------
                // PART 1: BEYOND THE EMAIL
                // -----------------------------------------------------------------
                {
                    id: 'bec_intro',
                    title: "Beyond the 'Nigerian Prince'",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE ILLUSION OF TRUST"
                                subtitle="Trust is your vulnerability."
                                icon={<FaUserSecret />}
                                color="#ff4757"
                            />

                            <div className="cr-grid-2">
                                <ConceptCard
                                    icon={<FaBriefcase />}
                                    title="BEC (Business Email Compromise)"
                                    description="The most financially damaging crime online. Attackers don't infect your computer; they infect your process. They impersonate trusted vendors or executives to authorize payments."
                                    color="#00d4ff"
                                />

                                <FactBox type="danger" title="THE STATS">
                                    BEC attacks have cost businesses <span className="highlight-red">$43 Billion</span> globally (FBI).
                                    <br /><br />
                                    <em>It relies on one thing: You not double-checking.</em>
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                // NEW LESSON: CALENDAR PHISHING
                {
                    id: 'calendar_phishing',
                    title: "Calendar Phishing",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="Calendar Inject Attacks"
                                subtitle="Your schedule is open. Attackers are booking it."
                                icon={<FaCalendarAlt />}
                                color="#eab308"
                            />

                            <p>
                                Email filters scan emails. But they often ignore <strong>Calendar Invites</strong>.
                                Attackers send a meeting request. It automatically appears on your phone's calendar.
                            </p>

                            <div className="cr-grid-2">
                                <ConceptCard
                                    icon={<FaExclamationTriangle />}
                                    title="The Notification Loop"
                                    description="Your phone buzzes: 'Meeting in 10 minutes: FINAL NOTICE'. You panic and click the link in the calendar event description."
                                    color="#eab308"
                                />
                                <FactBox type="warning" title="Defense">
                                    Never click links inside calendar invites from unknown senders. Delete the event; do not 'Decline' (this confirms your email is active).
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                // -----------------------------------------------------------------
                // PART 2: VISUAL DECEPTION (Interactive)
                // -----------------------------------------------------------------
                {
                    id: 'visual_deception',
                    title: "Visual Deception",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="Don't Believe Your Eyes"
                                icon={<FaEye />}
                                color="#d946ef"
                            />
                            <p className="cr-intro-text">
                                Your brain uses shortcuts to read. Hackers exploit these shortcuts.
                            </p>

                            <div className="interactive-zone">
                                <div className="interactive-title">
                                    <FaBug /> HOMOGRAPH ATTACKS
                                </div>
                                <p>Which of these domains is real? Look closely.</p>

                                <div className="phish-grid">
                                    <div className="test-item" style={{ textAlign: 'center' }}>
                                        <button className="phish-btn">
                                            apple.com
                                        </button>
                                        <div className="url-reveal safe visible">Latin ASCII 'a'</div>
                                    </div>
                                    <div className="test-item" style={{ textAlign: 'center' }}>
                                        <button className="phish-btn reveal-active">
                                            appIe.com
                                        </button>
                                        <div className="url-reveal danger visible">Cyrillic 'I' (Looks like l)</div>
                                    </div>
                                </div>

                                <div className="fact-box insane" style={{ textAlign: 'left' }}>
                                    <div className="fact-header"> <FaMobileAlt /> UNDER THE HOOD</div>
                                    <div className="fact-content">
                                        <strong>IDN Homograph Attacks:</strong><br />
                                        Attackers exploit <strong>Punycode</strong>. The Cyrillic 'a' (U+0430) looks identical to Latin 'a'.
                                        <br /><br />
                                        <strong>Defense:</strong> Inspect the SSL certificate. A fake cert will show <code>xn--pple-43d.com</code> instead of <code>apple.com</code>.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                },
                // -----------------------------------------------------------------
                // PART 3: THE AMYGDALA HIJACK
                // -----------------------------------------------------------------
                {
                    id: 'neuroscience',
                    title: "The Urgency Hack",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="Neuroscience of the Click"
                                icon={<FaBrain />}
                                color="#ff4757"
                            />

                            <div className="cr-grid-2">
                                <ConceptCard
                                    icon={<FaBomb />}
                                    title="AMYGDALA HIJACK"
                                    description="When stressed (e.g., 'URGENT PAYMENT'), your brain bypasses logic networks. You enter 'Fight or Flight'. You click to 'solve' the threat."
                                    color="#ff4757"
                                />
                                <ConceptCard
                                    icon={<FaUserSecret />}
                                    title="DEEPFAKES"
                                    description="AI (GANs) clones voice timbre using training data. It learns specific 'micro-tremors' of a target's larynx."
                                    color="#d946ef"
                                />
                            </div>
                        </div>
                    )
                },
                // -----------------------------------------------------------------
                // PART 4: THE FILE MASQUERADE
                // -----------------------------------------------------------------
                {
                    id: 'file_masquerade',
                    title: "The File Masquerade",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaFileAlt className="section-icon" style={{ color: '#ffd700' }} />
                                <h2>"IT'S JUST A PDF, RIGHT?"</h2>
                            </div>
                            <p className="lesson-text">
                                Windows hides file extensions by default. Attackers love this.
                                They name a virus <code>bonus_report.pdf.exe</code>.
                            </p>

                            <div className="cr-grid-2">
                                <div className="concept-card" style={{ '--card-color': '#ff4757' }}>
                                    <div className="concept-header">
                                        <div className="concept-icon"><FaBug /></div>
                                        <h4 className="concept-title">Double Extension Trick</h4>
                                    </div>
                                    <p className="concept-body">
                                        You see: <strong>invoice.pdf</strong>
                                        <br />
                                        Computer sees: <strong>invoice.pdf.exe</strong>
                                        <br /><br />
                                        Because Windows hides user-known file types, the <code>.exe</code> part is invisible. You click the "PDF" icon, and the malware executes.
                                    </p>
                                </div>

                                <div className="interactive-zone" style={{ marginTop: 0 }}>
                                    <div className="interactive-title">DETECT THE THREAT</div>
                                    <div className="phish-grid" style={{ gridTemplateColumns: '1fr' }}>
                                        <div className="test-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid #333' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <FaFilePdf style={{ fontSize: '2rem', color: '#ff4757' }} />
                                                <div style={{ textAlign: 'left' }}>
                                                    <div style={{ color: '#fff', fontWeight: 'bold' }}>Q4_Earnings.pdf.exe</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Application | 4.2 MB</div>
                                                </div>
                                            </div>
                                            <div className="highlight-red" style={{ fontSize: '0.9rem' }}>MALICIOUS</div>
                                        </div>

                                        <div className="test-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid #333' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <FaFilePdf style={{ fontSize: '2rem', color: '#00ff88' }} />
                                                <div style={{ textAlign: 'left' }}>
                                                    <div style={{ color: '#fff', fontWeight: 'bold' }}>Q4_Earnings.pdf</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Adobe Acrobat Document</div>
                                                </div>
                                            </div>
                                            <div style={{ color: '#00ff88', fontSize: '0.9rem' }}>SAFE</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                },
                // LESSON 5: MISSION BRIEFING
                {
                    id: 'mod1_mission_brief',
                    title: "Mission: PhishDetect OS",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaRocket className="section-icon" style={{ color: "#4f46e5" }} />
                                <h2>MISSION BRIEFING</h2>
                            </div>

                            <div className="cr-mission-brief-grid">
                                <div className="brief-col">
                                    <h5><FaShieldAlt /> Situation</h5>
                                    <p>
                                        We have intercepted a batch of suspicious emails targeting the Finance department.
                                        They mimic our internal communications.
                                    </p>
                                </div>
                                <div className="brief-col">
                                    <h5><FaCheckCircle /> Objectives</h5>
                                    <ol>
                                        <li><strong>ANALYZE</strong> sender headers for typos.</li>
                                        <li><strong>FLAG</strong> deceptive links and urgency triggers.</li>
                                        <li><strong>REPORT</strong> all malicious items to clear the inbox.</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="cr-final-warning" style={{ textAlign: "center" }}>
                                <p style={{ color: "#4f46e5", fontStyle: "italic", marginTop: "40px" }}>
                                    CLICK "START SIMULATION" BELOW TO LAUNCH PHISHDETECT OS
                                </p>
                            </div>
                        </div>
                    ),
                }

            ]
        },

        // =========================================================================
        // MODULE 2: Bypassing the Shield (Technical Exploitation)
        // =========================================================================
        {
            phaseId: 'p2_bypass_shield',
            phaseNumber: 2,
            title: 'Bypassing the Shield',
            type: 'learning',
            duration: '25 min',
            difficulty: 'Intermediate',
            xpReward: 800,
            description: 'Technical Exploitation: AiTM, OAuth Phishing, and why MFA isn\'t a silver bullet.',
            topics: ['AiTM', 'Evilginx', 'OAuth Consent', 'Quishing', 'BitB'],
            icon: <FaBug />,
            professor: {
                name: "0xSHADOW",
                title: "Red Team Lead // Rank: Global Elite",
                avatarIcon: <FaBiohazard />
            },
            lessons: [
                // -----------------------------------------------------------------
                // PART 1: AiTM (Adversary-in-the-Middle)
                // -----------------------------------------------------------------
                {
                    id: 'aitm_intro',
                    title: "Adversary-in-the-Middle",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="The Death of Simple MFA"
                                icon={<FaNetworkWired />}
                                color="#ff4757"
                            />

                            <ConceptCard
                                icon={<FaBug />}
                                title="SESSION HIJACKING"
                                description="You have 2FA enabled. You feel safe. You shouldn't. Attackers don't need your password. They want your Session Cookie."
                                color="#ff4757"
                            />

                            <div className="interactive-zone">
                                <div className="interactive-title">THE ATTACK CHAIN</div>
                                <div className="cr-diagram-box">
                                    <div className="diagram-step">
                                        <span className="step-num">1</span>
                                        <p>You visit a fake login page (Proxy).</p>
                                    </div>
                                    <div className="diagram-arrow">→</div>
                                    <div className="diagram-step">
                                        <span className="step-num">2</span>
                                        <p>Proxy forwards creds to Real Site.</p>
                                    </div>
                                    <div className="diagram-arrow">→</div>
                                    <div className="diagram-step">
                                        <span className="step-num">3</span>
                                        <p>Real Site sends 2FA code to your phone.</p>
                                    </div>
                                    <div className="diagram-arrow">→</div>
                                    <div className="diagram-step danger">
                                        <span className="step-num">4</span>
                                        <p>You enter code. Proxy steals the <strong>Cookie</strong>.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="fact-box insane">
                                <div className="fact-header"> <FaLaptopCode /> TOOL SHOWCASE: EVILGINX2</div>
                                <div className="fact-content">
                                    Uses <code>config.yaml</code> "phishlets" to proxy traffic.
                                    <br /><br />
                                    <div className="code-snippet" style={{ background: '#000', color: '#0f0', padding: '10px', fontSize: '0.8em', fontFamily: 'monospace', borderRadius: '4px' }}>
                                        phishlets:<br />
                                        &nbsp;&nbsp;- name: 'outlook'<br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;hostname: 'login.microsoftonline.com'<br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;sub_filters:<br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Triggers: ['ESTSAUTH', 'ESTSAUTHPERSISTENT']<br />
                                        <br />
                                        [+] Intercepted POST request: /common/login<br />
                                        [!] CAPTURED SESSION COOKIE: ESTSAUTH=0.AXIAMs...<br />
                                        [{'>'}] Redirecting victim to: portal.office.com (Authorized)
                                    </div>
                                    <br />
                                    The tool strips the secure flag and captures the token. It's game over.
                                </div>
                            </div>
                        </div>
                    )
                },
                // -----------------------------------------------------------------
                // PART 2: OAUTH PHISHING
                // -----------------------------------------------------------------
                {
                    id: 'oauth_phishing',
                    title: "OAuth Consent Phishing",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="The 'Accept Permissions' Trap"
                                icon={<FaKey />}
                                color="#ffd700"
                            />

                            <p style={{ marginBottom: 20 }}>
                                Attackers don't always ask for a password.
                                Sometimes they just ask for <strong>permission</strong>.
                            </p>

                            <div className="cr-mock-window" style={{ border: '1px solid #333', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                                <div className="mock-header" style={{ background: '#0078d4', color: 'white', padding: '10px' }}>
                                    Microsoft 365
                                </div>
                                <div className="mock-body" style={{ padding: 20, background: 'white', color: 'black' }}>
                                    <div className="app-icon-mock" style={{ fontSize: '3rem' }}>📅</div>
                                    <h4 style={{ color: '#333' }}> "Corporate Schedule Optimizer"</h4>
                                    <p>needs permission to:</p>
                                    <ul className="permission-list" style={{ textAlign: 'left', background: '#f0f0f0', padding: 10, borderRadius: 5 }}>
                                        <li><strong>Mail.ReadWrite:</strong> Read/Delete your emails</li>
                                        <li><strong>User.ReadWrite.All:</strong> Modify user profiles</li>
                                        <li><strong>offline_access:</strong> Access data indefinitely</li>
                                    </ul>
                                    <button className="cr-btn-mock accept" style={{ background: '#0078d4', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 4, marginTop: 10, cursor: 'pointer' }}>Accept</button>
                                </div>
                            </div>

                            <div className="fact-box danger" style={{ marginTop: 30 }}>
                                <div className="fact-header"> <FaExclamationTriangle /> CRITICAL RISK</div>
                                <div className="fact-content">
                                    If you click "Accept", no password change can save you. They have a permanent key (OAuth Token) to your inbox.
                                </div>
                            </div>
                        </div>
                    )
                },
                // -----------------------------------------------------------------
                // PART 3: QUISHING & BitB
                // -----------------------------------------------------------------
                {
                    id: 'quishing_bitb',
                    title: "Quishing & BitB",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-grid-2">
                                <ConceptCard
                                    icon={<FaMobileAlt />}
                                    title="Quishing (QR Phishing)"
                                    description="Attack Vector: The QR code contains a URL to a blob payload. Why it works: Email gateways scan text, not images."
                                    color="#00d4ff"
                                />
                                <ConceptCard
                                    icon={<FaLaptopCode />}
                                    title="Browser-in-the-Browser"
                                    description="A fake popup window drawn entirely in HTML/CSS. It looks like a real Chrome popup with the lock icon and correct URL. But it's just a picture."
                                    color="#d946ef"
                                />
                            </div>
                        </div>
                    )
                },
                // LESSON 4: MISSION BRIEFING
                {
                    id: 'mod2_mission_brief',
                    title: "Mission: Red Team Ops",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaRocket className="section-icon" style={{ color: "#f43f5e" }} />
                                <h2>MISSION BRIEFING</h2>
                            </div>

                            <div className="cr-mission-brief-grid">
                                <div className="brief-col">
                                    <h5><FaBug /> Situation</h5>
                                    <p>
                                        An Advanced Persistent Threat (APT) group is using a reverse proxy to bypass our 2FA defenses.
                                        You are the Red Team operator.
                                    </p>
                                </div>
                                <div className="brief-col">
                                    <h5><FaCheckCircle /> Objectives</h5>
                                    <ol>
                                        <li><strong>DEPLOY</strong> the Evilginx2 proxy server.</li>
                                        <li><strong>INTERCEPT</strong> the victim's credentials in real-time.</li>
                                        <li><strong>CAPTURE</strong> the session cookie to prove the vulnerability.</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="cr-final-warning" style={{ textAlign: "center" }}>
                                <p style={{ color: "#f43f5e", fontStyle: "italic", marginTop: "40px" }}>
                                    CLICK "START SIMULATION" BELOW TO INITIALIZE ATTACK
                                </p>
                            </div>
                        </div>
                    ),
                }
            ]
        },

        // =========================================================================
        // MODULE 3: The Human Firewall (Advanced Response)
        // =========================================================================
        {
            phaseId: 'p3_human_firewall',
            phaseNumber: 3,
            title: 'The Human Firewall',
            type: 'learning',
            duration: '20 min',
            difficulty: 'Intermediate',
            xpReward: 600,
            description: 'Defensive Protocols: FIDO2 Keys, Out-of-Band Verification, and the "Golden Hour".',
            topics: ['Zero Trust', 'FIDO2/WebAuthn', 'Incident Response', 'Golden Hour'],
            icon: <FaShieldAlt />,
            professor: {
                name: "AGENT CYBERBEARD",
                title: "Defense Ops // Rank: Grandmaster",
                avatarIcon: <FaUserGraduate />
            },
            lessons: [
                // -----------------------------------------------------------------
                // PART 1: THE AI VOICE THREAT
                // -----------------------------------------------------------------
                {
                    id: 'ai_voice_intro',
                    title: "The Synthesized Voice",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title='"THAT SOUNDS LIKE MY BOSS"'
                                subtitle="Generative AI Vishing"
                                icon={<FaMicrophoneAlt />}
                                color="#ff4757"
                            />
                            <p className="lesson-text">
                                Forget email. Attackers can now clone your CEO's voice with just 3 seconds of audio from a YouTube video.
                            </p>
                            <ConceptCard
                                icon={<FaWaveSquare />}
                                title="Generative Audio (Vishing)"
                                description="Deepfake Audio has changed the game. If you receive a call from a known number, with a known voice, asking for an urgent transfer... It is likely a bot."
                                color="#d946ef"
                            />
                        </div>
                    )
                },
                // -----------------------------------------------------------------
                // PART 2: THE VISHING CONSOLE (NO AUDIO)
                // -----------------------------------------------------------------
                {
                    id: 'vishing_analysis',
                    title: "Analyze the Call",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="INCOMING CALL ANALYSIS"
                                icon={<FaHeadset />}
                                color="#ff9f43"
                            />
                            <p>We recorded a suspicious call. Review the <strong>transcript</strong> below.</p>

                            <div className="cr-vishing-console">
                                <div className="console-header">
                                    <span>ID: CALL_8829_LOG</span>
                                    <span>STATUS: FLAGGED</span>
                                </div>
                                <div className="console-track">
                                    <div className="sound-wave-bar">
                                        <div className="wave-line"></div><div className="wave-line"></div><div className="wave-line"></div>
                                        <div className="wave-line"></div><div className="wave-line"></div><div className="wave-line"></div>
                                    </div>
                                </div>
                                <div className="transcript-box">
                                    <div className="transcript-line">
                                        <span className="speaker-tag victim">YOU</span>
                                        Hello?
                                    </div>
                                    <div className="transcript-line">
                                        <span className="speaker-tag attacker">CEO_VOICE</span>
                                        "Hey, look I'm stuck in a meeting with the board. My access token just expired."
                                    </div>
                                    <div className="transcript-line">
                                        <span className="speaker-tag attacker">CEO_VOICE</span>
                                        "I need you to read me the <span className="tactic-highlight" data-tooltip="Creating Urgency">6-digit code</span> from your Authenticator. Now."
                                    </div>
                                    <div className="transcript-line">
                                        <span className="speaker-tag victim">YOU</span>
                                        "Uh, shouldn't I put in a ticket?"
                                    </div>
                                    <div className="transcript-line">
                                        <span className="speaker-tag attacker">CEO_VOICE</span>
                                        "<span className="tactic-highlight" data-tooltip="Appeal to Authority">Do you want me to lose this deal?</span> Just read the code!"
                                    </div>
                                </div>
                            </div>
                            <FactBox type="danger" title="DETECTION LOGIC">
                                Why this is fake:
                                <ul style={{ marginTop: 5, paddingLeft: 20 }}>
                                    <li><strong>Urgency:</strong> Demands immediate action.</li>
                                    <li><strong>Bypassing Process:</strong> "My token expired" (Common pretext).</li>
                                    <li><strong>No visuals:</strong> Vishing relies on the lack of body language.</li>
                                </ul>
                            </FactBox>
                        </div>
                    )
                },
                // -----------------------------------------------------------------
                // PART 2.5: CALLBACK PHISHING
                // -----------------------------------------------------------------
                {
                    id: 'callback_phishing',
                    title: "The Callback Trap",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="BazarCall / The Callback Trap"
                                subtitle="When the attacker wants YOU to call THEM."
                                icon={<FaPhone />}
                                color="#eab308"
                            />

                            <p className="lesson-text">
                                Modern phishing isn't just about clicking links. It's about getting you on the phone.
                            </p>

                            <div className="cr-grid-2">
                                <ConceptCard
                                    icon={<FaExpandArrowsAlt />}
                                    title="The Lure"
                                    description="You get an email: 'Subscription Renewed: $899 charged to your card.' No links. Just a phone number to 'cancel'."
                                    color="#eab308"
                                />
                                <FactBox type="warning" title="The Trap">
                                    You call the number in a panic. The 'Support Agent' (Attacker) guides you to a 'remote support' site to 'process your refund'. They then install malware or steal banking credentials.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                // -----------------------------------------------------------------
                // PART 3: THE DEFENSE
                // -----------------------------------------------------------------
                {
                    id: 'verify_protocol',
                    title: "The Kill Switch",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="HANG UP AND CALL BACK"
                                icon={<FaPhoneSlash />}
                                color="#00ff88"
                            />
                            <p className="lesson-text">
                                The only way to verify a voice is to <strong>initiate</strong> the connection yourself.
                            </p>

                            <div className="cr-grid-2">
                                <div className="concept-card" style={{ '--card-color': '#00ff88' }}>
                                    <div className="concept-header">
                                        <h4 className="concept-title">Trusted Channel</h4>
                                    </div>
                                    <p className="concept-body">
                                        If the CEO calls you, hang up.
                                        <br />
                                        Call them back on their <strong>internal desk line</strong> or Slack them.
                                        <br />
                                        <em>Bots cannot answer the internal line.</em>
                                    </p>
                                </div>
                                <FactBox type="danger" title="CHALLENGE QUESTIONS">
                                    "What did we discuss in the staff meeting yesterday?"
                                    <br />
                                    <em>(AI doesn't know context that isn't public).</em>
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                // LESSON 4: MISSION BRIEFING
                {
                    id: 'mod3_mission_brief',
                    title: "Mission: Secure Comms",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="MISSION BRIEFING"
                                icon={<FaRocket />}
                                color="#00ff88"
                            />

                            <div className="cr-mission-brief-grid">
                                <div className="brief-col">
                                    <h5><FaMicrophoneAlt /> Situation</h5>
                                    <p>
                                        Executives are reporting calls from "themselves" asking for urgent transfers.
                                        We suspect Deepfake Audio (Vishing).
                                    </p>
                                </div>
                                <div className="brief-col">
                                    <h5><FaCheckCircle /> Objectives</h5>
                                    <ol>
                                        <li><strong>LISTEN</strong> for audio artifacts and unnatural pauses.</li>
                                        <li><strong>CHALLENGE</strong> the caller with context questions.</li>
                                        <li><strong>HANG UP</strong> and verify via a trusted channel.</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="cr-final-warning" style={{ textAlign: "center" }}>
                                <p style={{ color: "#00ff88", fontStyle: "italic", marginTop: "40px" }}>
                                    CLICK "START SIMULATION" BELOW TO OPEN SECURE LINE
                                </p>
                            </div>
                        </div>
                    ),
                }
            ]
        },

        // =========================================================================
        // PHASE 4: THE EXAM
        // =========================================================================
        {
            phaseId: 'p4_phishing_exam',
            phaseNumber: 4,
            // SYNCED WITH REGISTRY: The Gauntlet
            ...syncScenario('sc_phishing_gauntlet', {
                title: 'Exam: The Phishing Gauntlet',
                xpReward: 2000,
                duration: '30 min',
                difficulty: 'Intermediate'
            }),
            type: 'scenario',
            scenarioId: 'sc_phishing_gauntlet',
            description: 'FINAL EXAM: You are the inbox guardian. 10 Emails. 3 Deepfakes. Zero margin for error.',
            topics: ['Analysis', 'Reporting', 'Crisis Management'],
            icon: <FaShieldAlt />
        }
    ]
};

export default PhishingDefense;
