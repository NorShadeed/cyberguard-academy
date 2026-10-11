import React from 'react';
import {
    FaShieldAlt, FaSearch, FaFingerprint, FaUsers, FaNetworkWired,
    FaBug, FaUserGraduate, FaExclamationTriangle, FaLock, FaClock, FaBriefcase, FaGift, FaList, FaMobileAlt, FaUserSecret, FaRocket, FaCheckCircle,
    FaHdd, FaTrash, FaBroom // Added icons for Ransomware/Hygiene
} from 'react-icons/fa';
import { getScenarioById } from '../ScenarioRegistry';
import { ConceptCard, FactBox, HeroSection } from '../../features/training/components/TrainingUI'; // New UI Imports


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

const CyberAwareness = {
    id: 'security-awareness',
    title: 'Cyber Awareness Fundamentals',
    category: 'Foundation',
    icon: <FaShieldAlt />,
    color: '#00d4ff',
    image: '/images/course-security-pixel.png',
    description: 'The frontline defense against cyber threats. Detailed training on Phishing, Social Engineering, and Physical Security.',
    businessValue: 'Empower every employee to act as a human firewall, reducing the risk of successful social engineering attacks by 90%.',
    targetAudience: 'All Employees (Corporate Defender Track)',
    certificateName: 'Human Firewall Badge',

    outcomes: [
        'Analyze email headers and bodies for hidden phishing indicators',
        'Identify psychological manipulation tactics in real-time',
        'Secure physical workspaces against unauthorized access',
        'Respond correctly to simulated social engineering attacks',
        'Protect corporate credentials and 2FA codes'
    ],

    roi: {
        riskReduction: '90%',
        avgIncidentCost: '$4.35M',
        timeToValue: 'Immediate',
        complianceStandards: ['NIST', 'ISO 27001', 'SOC 2']
    },

    phases: [
        // PHASE 1: LEARNING (Interactive)
        {
            phaseId: 'p1_phishing_detect',
            phaseNumber: 1,
            title: 'The Phishing Detective',
            type: 'learning',
            duration: '15 min',
            difficulty: 'Beginner',
            xpReward: 400,
            description: 'Interactive Workshop: Use the "Forensic Scanner" to inspect suspicious emails and identify red flags.',
            topics: ['Email Headers', 'URL Analysis', 'Urgency Tactics'],
            icon: <FaSearch />,
            // TEACHING CONTENT EMBEDDED
            professor: {
                name: "PROFESSOR CYBERBEARD",
                title: "Academy Instructor // Rank: Grandmaster",
                avatarIcon: <FaUserGraduate />
            },
            lessons: [
                // =========================================================================
                // PART 1: THE RECRUITMENT
                // =========================================================================
                {
                    id: 'intro_sequence',
                    title: "Classified Briefing",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="CLASSIFIED BRIEFING"
                                subtitle="Welcome to the Program, Agent."
                                icon={<FaUserSecret />}
                                color="#ff4757"
                            />

                            <div className="cr-grid-2">
                                <ConceptCard
                                    icon={<FaShieldAlt />}
                                    title="The Mission"
                                    description="You're not here to 'spot emails.' You're being trained to detect deception at the neurological level. We're rewiring your threat-detection instincts—the same ones that kept your ancestors alive."
                                    color="#00d4ff"
                                />
                                <ConceptCard
                                    icon={<FaBug />}
                                    title="The Enemy"
                                    description="You're facing nation-state hackers, organized crime syndicates, and AI-powered attack platforms. They have budgets in the billions. Your weapon? Pattern recognition and critical thinking."
                                    color="#ff4757"
                                />
                            </div>

                            <FactBox type="danger" title="THE BATTLEFIELD">
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#ff4757' }}>91%</div>
                                        <div style={{ fontSize: '0.9em', opacity: 0.9 }}>of cyberattacks start with phishing</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#ff4757' }}>$4.35M</div>
                                        <div style={{ fontSize: '0.9em', opacity: 0.9 }}>average breach cost (2024)</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#ff4757' }}>12 sec</div>
                                        <div style={{ fontSize: '0.9em', opacity: 0.9 }}>average time to click malicious link</div>
                                    </div>
                                </div>
                                <em>"Amateurs hack systems. Professionals hack people."</em>
                                <br />— Bruce Schneier, Security Technologist
                                <br /><br />
                                <em>"It's easier to fool people than to convince them they've been fooled."</em>
                                <br />— Mark Twain
                            </FactBox>

                            <div style={{ marginTop: '30px', padding: '25px', background: 'rgba(255, 71, 87, 0.1)', border: '2px solid rgba(255, 71, 87, 0.3)', borderRadius: '12px' }}>
                                <h4 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FaExclamationTriangle style={{ color: '#ff4757' }} /> Real Attack: SolarWinds (2020)
                                </h4>
                                <p style={{ margin: '0 0 10px 0', lineHeight: '1.6' }}>
                                    Russian intelligence operatives spent <strong>months</strong> building trust with employees.
                                    They didn't "hack in"—they were <strong>invited</strong> through a single compromised email.
                                    18,000 organizations were breached, including the U.S. Treasury and Pentagon.
                                </p>
                                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px', fontStyle: 'italic', textAlign: 'center' }}>
                                    This is not theoretical. This is happening right now.
                                </div>
                            </div>
                        </div>
                    )
                },
                // =========================================================================
                // PART 2: THE PSYCHOLOGY OF HACKING HUMANS
                // =========================================================================
                {
                    id: 'psych_warfare',
                    title: "Psychological Warfare",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaUsers className="section-icon" />
                                <h2>How They Hack Your Brain</h2>
                            </div>

                            <p className="cr-intro-text">
                                Hackers know they can't break our 256-bit encryption. So they don't try.
                                Instead, they exploit the <strong>legacy hardware</strong> between your ears.
                            </p>

                            <div className="cr-triad-grid">
                                {/* CARD 1: FEAR */}
                                <div className="cr-card-interactive">
                                    <div className="card-icon-header red"><FaExclamationTriangle /></div>
                                    <h3>1. URGENCY & FEAR</h3>
                                    <p>"Your account will be DELETED in 1 hour!"</p>
                                    <div className="card-reveal">
                                        <strong>Why it works:</strong>{' '}
                                        Fear shuts down the analytical part of your brain (Amygdala Hijack). You act before you think.
                                    </div>
                                    <div className="cr-micro-example">
                                        <span className="scam-text">ACT NOW OR LOSE EVERYTHING</span>
                                    </div>
                                </div>

                                {/* CARD 2: AUTHORITY */}
                                <div className="cr-card-interactive">
                                    <div className="card-icon-header purple"><FaBriefcase /></div>
                                    <h3>2. AUTHORITY</h3>
                                    <p>"Transfer these funds immediately. - The CEO"</p>
                                    <div className="card-reveal">
                                        <strong>Why it works:</strong>{' '}
                                        We are conditioned to obey authority figures. Disobeying feels dangerous.
                                    </div>
                                    <div className="cr-micro-example">
                                        <span className="scam-text">EXECUTIVE ORDER #9921</span>
                                    </div>
                                </div>

                                {/* CARD 3: GREED */}
                                <div className="cr-card-interactive">
                                    <div className="card-icon-header gold"><FaGift /></div>
                                    <h3>3. GREED & CURIOSITY</h3>
                                    <p>"Here is the Salary Spreadsheet for the whole team."</p>
                                    <div className="card-reveal">
                                        <strong>Why it works:</strong>{' '}
                                        The promise of secret knowledge or reward is irresistible. FOMO is a vulnerability.
                                    </div>
                                    <div className="cr-micro-example">
                                        <span className="scam-text">BONUS_Q4_CONFIDENTIAL.xlsx</span>
                                    </div>
                                </div>

                                {/* CARD 4: SOCIAL PROOF */}
                                <div className="cr-card-interactive">
                                    <div className="card-icon-header green"><FaUsers /></div>
                                    <h3>4. SOCIAL PROOF</h3>
                                    <p>"Everyone on the team has already verified their accounts. You're the last one."</p>
                                    <div className="card-reveal">
                                        <strong>Why it works:</strong>{' '}
                                        Humans are herd animals. We assume if others are doing it, it must be safe (Bandwagon Effect).
                                    </div>
                                    <div className="cr-micro-example">
                                        <span className="scam-text">15/16 team members have complied</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                },
                // =========================================================================
                // PART 3: THE ANATOMY OF A LIE (Detailed Breakdown)
                // =========================================================================
                {
                    id: 'anatomy_header',
                    title: "Email Autopsy Lab: CEO Fraud",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="EMAIL AUTOPSY LAB"
                                subtitle="Dissect a real attack that stole $250,000 from a Fortune 500 company"
                                icon={<FaSearch />}
                                color="#a855f7"
                            />

                            <p>
                                Let's perform an autopsy on a real Business Email Compromise (BEC) attack.
                                In 2019, a Finance Manager received this email and wired $250,000 to attackers within 15 minutes.
                            </p>

                            <div style={{ marginTop: '25px', padding: '25px', background: 'rgba(168, 85, 247, 0.05)', border: '2px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '10px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#a855f7' }}>CASE #2019-WHALE-047</span>
                                    <span style={{ fontWeight: 'bold', color: '#ff4757' }}>THREAT LEVEL: CRITICAL</span>
                                </div>

                                {/* Email Headers */}
                                <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9em' }}>
                                    <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <span style={{ color: '#888' }}>From (Display):</span>{' '}
                                        <span>CEO John Williams</span>{' '}
                                        <span style={{ marginLeft: '10px', padding: '2px 8px', background: 'rgba(255, 193, 7, 0.2)', borderRadius: '4px', fontSize: '0.8em', color: '#ffc107' }}>📢 EASILY FAKED</span>
                                    </div>
                                    <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <span style={{ color: '#888' }}>From (Email):</span>{' '}
                                        <span style={{ color: '#ff4757', fontWeight: 'bold' }}>j.williams@secure-corp-portal.com</span>{' '}
                                        <span style={{ marginLeft: '10px', padding: '2px 8px', background: 'rgba(255, 71, 87, 0.2)', borderRadius: '4px', fontSize: '0.8em', color: '#ff4757' }}>🚨 MALICIOUS</span>
                                    </div>
                                    <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <span style={{ color: '#888' }}>To:</span>{' '}
                                        <span>sarah.chen@company.com</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#888' }}>Subject:</span>{' '}
                                        <span>URGENT: Confidential Acquisition - Wire Transfer Needed</span>{' '}
                                        <span style={{ marginLeft: '10px', padding: '2px 8px', background: 'rgba(255, 193, 7, 0.2)', borderRadius: '4px', fontSize: '0.8em', color: '#ffc107' }}>⚠️ URGENCY TRIGGER</span>
                                    </div>
                                </div>

                                {/* Email Body */}
                                <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', marginBottom: '20px' }}>
                                    <div style={{ marginBottom: '15px' }}>Sarah,</div>
                                    <div style={{ marginBottom: '15px', lineHeight: '1.6' }}>
                                        We are finalizing the <strong style={{ borderBottom: '2px solid #f97316' }}>acquisition of TechVenture Inc.</strong> The lawyers need the wire transfer completed by end of business today or the deal falls through.
                                    </div>
                                    <div style={{ marginBottom: '15px', lineHeight: '1.6', background: 'rgba(255, 71, 87, 0.1)', padding: '10px', borderLeft: '3px solid #ff4757' }}>
                                        This is highly confidential - do NOT discuss with anyone, including our CFO. I'm handling this directly with the board.
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong>Wire Details:</strong><br />
                                        Account: 4721-8893-2100<br />
                                        Routing: 021000021<br />
                                        Amount: $250,000 USD<br />
                                        Bank: International Holdings LLC
                                    </div>
                                    <div style={{ marginBottom: '15px', lineHeight: '1.6', background: 'rgba(255, 193, 7, 0.1)', padding: '10px', borderLeft: '3px solid #ffc107' }}>
                                        I'm in back-to-back meetings. Just confirm via reply when it's done.
                                    </div>
                                    <div>John</div>
                                </div>

                                {/* Threat Indicators */}
                                <div style={{ padding: '20px', background: 'rgba(255, 71, 87, 0.1)', borderRadius: '8px', border: '2px solid rgba(255, 71, 87, 0.3)' }}>
                                    <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FaBug /> Threat Indicators Detected: 7
                                    </h4>
                                    <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
                                        <li>❌ <strong>Domain Mismatch:</strong> Email from external domain, not company.com</li>
                                        <li>❌ <strong>Urgency Manipulation:</strong> "End of business today or deal falls through"</li>
                                        <li>❌ <strong>Isolation Tactic:</strong> "Do NOT discuss with anyone"</li>
                                        <li>❌ <strong>Authority Abuse:</strong> Claims to be CEO</li>
                                        <li>❌ <strong>Unusual Request:</strong> CEOs don't typically handle wire transfers</li>
                                        <li>❌ <strong>Secrecy Demand:</strong> Prevents victim from verifying with CFO</li>
                                        <li>❌ <strong>No Corporate Signature:</strong> Real CEO emails have company branding</li>
                                    </ul>
                                </div>
                            </div>

                            <FactBox type="danger" title="ACTUAL OUTCOME">
                                The Finance Manager wired $250,000 to the attackers within 15 minutes of receiving this email.
                                By the time the fraud was discovered 2 hours later, the money had been laundered through 14 countries and was unrecoverable.
                                <br /><br />
                                <strong>Attack Duration:</strong> 15 minutes
                                <br />
                                <strong>Research Time:</strong> The criminal spent 4 hours researching the target on LinkedIn
                                <br />
                                <strong>Recovery Rate:</strong> $0 recovered
                            </FactBox>

                            <div style={{ marginTop: '25px', padding: '20px', background: 'rgba(0, 212, 255, 0.1)', border: '2px solid rgba(0, 212, 255, 0.3)', borderRadius: '12px' }}>
                                <h4 style={{ marginBottom: '15px', color: '#00d4ff' }}>
                                    ✅ How This Could Have Been Prevented
                                </h4>
                                <ul style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
                                    <li><strong>Check the Email Domain:</strong> The sender was NOT from @company.com</li>
                                    <li><strong>Call Back Verification:</strong> Call the CEO on their known number (not from email)</li>
                                    <li><strong>Dual Approval:</strong> All wire transfers over $10k require CFO approval</li>
                                    <li><strong>Ignore Urgency:</strong> Real executives understand that security &gt; speed</li>
                                    <li><strong>Trust Process Over Pressure:</strong> Follow company procedures, even if pressured</li>
                                </ul>
                            </div>
                        </div >
                    )
                },
                // =========================================================================
                // PART 4: URL FORENSICS (Interactive)
                // =========================================================================
                {
                    id: 'url_forensics',
                    title: "Interactive: URL Forensics",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaNetworkWired className="section-icon" />
                                <h2>The Hyperlink Trap</h2>
                            </div>

                            <p>
                                The blue text is a lie. The button is a lie.
                                The only truth is in the <strong>status bar</strong>.
                            </p>

                            <div className="cr-interactive-demo-zone">
                                <h3><FaRocket /> LIVE EXERCISE: HOVER TEST</h3>
                                <p>Hover over the buttons below. Do NOT click. Decode the destination.</p>

                                <div className="cr-button-test-grid">
                                    {/* BUTTON 1: SAFE */}
                                    <div className="test-item">
                                        <button className="cr-btn-mock safe">Reset Password</button>
                                        <div className="url-reveal safe">Target: https://company.com/reset</div>
                                        <div className="status-indicator"><FaCheckCircle /> SAFE</div>
                                    </div>

                                    {/* BUTTON 2: PHISH */}
                                    <div className="test-item">
                                        <button className="cr-btn-mock danger">Claim Prize</button>
                                        <div className="url-reveal danger">Target: http://win-iphone-now.xyz/claim</div>
                                        <div className="status-indicator"><FaExclamationTriangle /> DANGER</div>
                                    </div>

                                    {/* BUTTON 3: TRICKY */}
                                    <div className="test-item">
                                        <button className="cr-btn-mock warning">View Document</button>
                                        <div className="url-reveal warning">Target: https://dropbox.com.share-file.io/login</div>
                                        <div className="status-indicator"><FaBug /> TRICKY (Look at the END)</div>
                                    </div>
                                </div>

                                <div className="cr-lesson-note">
                                    <strong>PRO TIP:</strong> Read URLs from Right to Left.
                                    The "Real" domain is the one just before the first single slash (/).
                                    <br />
                                    <em>dropbox.com.share-file.io</em> is hosted on <strong>share-file.io</strong>, NOT dropbox.
                                </div>
                            </div>

                            {/* MODERN URL DECEPTION TECHNIQUES */}
                            <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(168, 85, 247, 0.1)', border: '2px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px' }}>
                                <h4 style={{ marginBottom: '20px', color: '#a855f7' }}>
                                    <FaBug style={{ marginRight: '10px' }} />
                                    Modern URL Deception Techniques (2024-2026)
                                </h4>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {/* Homograph Attack */}
                                    <div style={{ padding: '15px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', borderLeft: '4px solid #ff4757' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ff4757' }}>
                                            🎭 Homograph Attack (Punycode)
                                        </div>
                                        <div style={{ fontFamily: 'monospace', marginBottom: '5px' }}>
                                            Fake: https://аpple.com/login
                                        </div>
                                        <div style={{ fontFamily: 'monospace', marginBottom: '10px', opacity: 0.7 }}>
                                            Real: https://xn--pple-43d.com/login
                                        </div>
                                        <div style={{ fontSize: '0.9em', lineHeight: '1.5' }}>
                                            The "а" is <strong>Cyrillic, not Latin</strong>. Looks identical to humans, but goes to attacker's server.
                                        </div>
                                    </div>

                                    {/* Subdomain Trick */}
                                    <div style={{ padding: '15px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', borderLeft: '4px solid #f97316' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#f97316' }}>
                                            🔗 Subdomain Trick
                                        </div>
                                        <div style={{ fontFamily: 'monospace', marginBottom: '5px' }}>
                                            https://amazon.com.verify-account.net/login
                                        </div>
                                        <div style={{ fontFamily: 'monospace', marginBottom: '10px', color: '#f97316' }}>
                                            Real domain: <strong>verify-account.net</strong>
                                        </div>
                                        <div style={{ fontSize: '0.9em', lineHeight: '1.5' }}>
                                            Everything before that is just a subdomain they control. It's their website, not Amazon's.
                                        </div>
                                    </div>

                                    {/* URL Shortener */}
                                    <div style={{ padding: '15px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', borderLeft: '4px solid #eab308' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#eab308' }}>
                                            📎 URL Shortener Masking
                                        </div>
                                        <div style={{ fontFamily: 'monospace', marginBottom: '10px' }}>
                                            https://bit.ly/PayrollUpdate
                                        </div>
                                        <div style={{ fontSize: '0.9em', lineHeight: '1.5' }}>
                                            Could redirect <strong>ANYWHERE</strong>. Never click shortened links in unexpected emails.
                                            <br />
                                            <strong>Pro Tip:</strong> Add "+" to end (bit.ly/PayrollUpdate+) to preview destination.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                },
                // =========================================================================
                // PART 5: ADVANCED TACTICS
                // =========================================================================
                {
                    id: 'advanced_tactics',
                    title: "Advanced Tactics: Spear Phishing",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="Advanced Tactics: Spear Phishing"
                                subtitle="When it gets personal."
                                icon={<FaSearch />
                                }
                                color="#f97316"
                            />

                            <div className="cr-grid-2">
                                <div className="cr-text-col">
                                    <h3>Spear Phishing</h3>
                                    <p>
                                        Standard phishing is casting a wide net (spam).
                                        <strong>Spear Phishing</strong> is hunting a specific target. You.
                                    </p>
                                    <p>
                                        They research you on LinkedIn. They know your job title, your boss's name, and that you just attended the "Cyber Summit 2024".
                                    </p>

                                    <div className="cr-chat-bubble-mock">
                                        <div className="msg-meta">LinkedIn Message • 2 mins ago</div>
                                        <div className="msg-body">
                                            "Hey [Name], great meeting you at the Cyber Summit! I have those photos we took. Check them out here: [Link]"
                                        </div>
                                    </div>
                                </div>

                                <div className="cr-visual-col">
                                    <ConceptCard
                                        icon={<FaUserSecret />}
                                        title="CEO Fraud (Whaling)"
                                        description="Impersonating a C-level executive to authorize wire transfers. Watch for: Unusual money requests, 'Don't tell anyone', and personal email addresses (gmail/yahoo)."
                                        color="#f97316"
                                    />
                                </div>
                            </div>
                        </div >
                    )
                },
                // =========================================================================
                // PART 6: RANSOMWARE 101 (NEW)
                // =========================================================================
                {
                    id: 'ransomware_101',
                    title: "Ransomware 101",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="RANSOMWARE"
                                subtitle="The Digital Hostage Situation"
                                icon={<FaHdd />}
                                color="#ff4757"
                            />

                            <p>
                                Imagine opening your laptop and seeing a red screen with a countdown timer.
                                All your files are locked. They want $50,000 in Bitcoin to unlock them.
                            </p>

                            <div className="cr-grid-2">
                                <ConceptCard
                                    icon={<FaLock />}
                                    title="The Encryption Phase"
                                    description="Malware silently scans your drive and encrypts your documents with a military-grade key. Once finished, it deletes the original files."
                                    color="#ff4757"
                                />
                                <ConceptCard
                                    icon={<FaBriefcase />}
                                    title="Triple Extortion"
                                    description="Modern gangs don't just lock your files. They steal them first. If you don't pay, they leak your sensitive data online."
                                    color="#ff4757"
                                />
                            </div>

                            <FactBox title="Never Pay the Ransom" type="danger">
                                1. There is no guarantee you will get your files back.
                                <br />
                                2. You are funding future attacks (and terrorism).
                                <br />
                                3. <strong>Solution:</strong> Robust, offline backups.
                            </FactBox>
                        </div>
                    )
                },
                // =========================================================================
                // PART 7: DIGITAL HYGIENE (NEW)
                // =========================================================================
                {
                    id: 'digital_hygiene',
                    title: "Digital Hygiene",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="Digital Hygiene"
                                subtitle="Clean Desk, Clean Screen, Clean Conscience."
                                icon={<FaBroom />}
                                color="#2ecc71"
                            />

                            <div className="cr-grid-3">
                                <div className="cr-card">
                                    <FaLock size={30} color="#2ecc71" />
                                    <h4>Lock Your Screen</h4>
                                    <p>Win+L (Windows) or Cmd+Ctrl+Q (Mac) every time you stand up.</p>
                                </div>
                                <div className="cr-card">
                                    <FaTrash size={30} color="#2ecc71" />
                                    <h4>Shred It</h4>
                                    <p>Don't throw sticky notes with passwords in the trash. Shred them.</p>
                                </div>
                                <div className="cr-card">
                                    <FaHdd size={30} color="#2ecc71" />
                                    <h4>Reboot</h4>
                                    <p>Restarting your computer once a week applies critical patches.</p>
                                </div>
                            </div>
                        </div>
                    )
                },
                // =========================================================================
                // PART 8: AI THREATS - DEEPFAKES & VOICE CLONING (NEW)
                // =========================================================================
                {
                    id: 'ai_threats',
                    title: "The AI Threat: When You Can't Trust Your Eyes",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="GENERATION AI: THE NEW BATTLEFIELD"
                                subtitle="When you can't trust your eyes or ears"
                                icon={<FaRocket />}
                                color="#9333ea"
                            />

                            <p className="cr-intro-text">
                                The most dangerous attacks in 2024-2026 aren't using sophisticated malware.
                                They're using <strong>Artificial Intelligence</strong> to clone voices, faces, and entire identities.
                            </p>

                            <div className="cr-grid-2">
                                <ConceptCard
                                    icon={<FaMobileAlt />}
                                    title="Voice Cloning"
                                    description="Attackers only need 3 seconds of your CEO's voice (from a podcast or earnings call) to clone it perfectly. AI can then make them 'say' anything in a phone call."
                                    color="#9333ea"
                                />
                                <ConceptCard
                                    icon={<FaNetworkWired />}
                                    title="Deepfake Video Calls"
                                    description="In 2024, a Hong Kong company lost $25M in a Zoom call with their 'CFO.' It was a deepfake. The AI mimicked facial expressions, voice, and mannerisms perfectly."
                                    color="#dc2626"
                                />
                            </div>

                            <FactBox type="warning" title="DEFENSE PROTOCOL: VERBAL AUTHENTICATION">
                                <strong>For high-risk requests</strong> (wire transfers, credential sharing), establish a pre-agreed "codeword" with executives.
                                <br /><br />
                                <strong>Example:</strong> If your boss calls asking for a wire transfer, ask them:
                                <br />
                                "Can you remind me of the project code for this?"
                                <br /><br />
                                <strong>Expected Response:</strong> Pre-established codeword (e.g., "Project Nightingale")
                                <br /><br />
                                If they can't provide it, or get defensive, it's likely a deepfake attack.
                                <br /><br />
                                <em>Note: Most humans can only detect deepfakes 50-60% of the time—barely better than chance.
                                    That's why process-based verification is critical.</em>
                            </FactBox>

                            <div style={{ marginTop: '25px', padding: '20px', background: 'rgba(147, 51, 234, 0.1)', border: '2px solid rgba(147, 51, 234, 0.3)', borderRadius: '12px' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                    <FaExclamationTriangle style={{ color: '#9333ea' }} /> Real Case: Hong Kong Finance Team (2024)
                                </h4>
                                <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                                    A finance worker joined what appeared to be a video call with the company's CFO and several colleagues.
                                    Everyone looked and sounded real. The "CFO" requested a $25 million transfer.
                                </p>
                                <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                                    <strong>The Truth:</strong> Every single person on the call was a deepfake.
                                    The attackers used publicly available photos and videos to create AI avatars.
                                </p>
                                <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px', fontWeight: 'bold', textAlign: 'center', color: '#9333ea' }}>
                                    $25,000,000 stolen in a single video call
                                </div>
                            </div>

                            <div style={{ marginTop: '25px', padding: '20px', background: 'rgba(0, 212, 255, 0.1)', border: '2px solid rgba(0, 212, 255, 0.3)', borderRadius: '12px' }}>
                                <h4 style={{ marginBottom: '15px', color: '#00d4ff' }}>
                                    🛡️ Your AI Defense Strategy
                                </h4>
                                <ul style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
                                    <li><strong>Verbal Authentication:</strong> Use pre-shared codewords for sensitive requests</li>
                                    <li><strong>Call Back Verification:</strong> Hang up and call them back on a known number</li>
                                    <li><strong>Multi-Channel Confirmation:</strong> Verify via email, Slack, and phone</li>
                                    <li><strong>Trust Your Gut:</strong> If something feels "off," it probably is</li>
                                    <li><strong>Delay High-Risk Actions:</strong> Never approve same-day wire transfers over $10k</li>
                                </ul>
                            </div>
                        </div>
                    )
                },
                // =========================================================================
                // PART 9: MISSION BRIEFING
                // =========================================================================
                {
                    id: 'final_briefing',
                    title: "Mission: Operation Inbox Zero",
                    content: (
                        <div className="cr-lesson-container center-aligned">
                            <div className="cr-mission-display">
                                <div className="mission-icon-static"><FaShieldAlt /></div>
                                <h2>OPERATION: INBOX ZERO</h2>
                                <h4 className="mission-subtitle">LIVE FIRE EXERCISE</h4>
                            </div>

                            <div className="cr-mission-brief-grid">
                                <div className="brief-col">
                                    <h5><FaList /> Intel Report</h5>
                                    <p>
                                        We have intercepted <strong>5 Emails</strong> headed for the CEO's inbox.
                                        Our filters are unsure. It is up to you to manually analyze them.
                                    </p>
                                </div>
                                <div className="brief-col">
                                    <h5><FaRocket /> Objectives</h5>
                                    <ol>
                                        <li><strong>ANALYZE</strong> every header, link, and attachment.</li>
                                        <li><strong>IDENTIFY</strong> the psychological triggers.</li>
                                        <li><strong>REPORT</strong> only the malicious threats.</li>
                                        <li><strong>IGNORE</strong> the safe emails.</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="cr-final-warning">
                                <p>
                                    <strong>Rules of Engagement:</strong>
                                    <br />
                                    Reporting a safe email is a failure (False Positive).
                                    <br />
                                    Clicking a phishing link is a catastrophe (False Negative).
                                    <br />
                                    <br />
                                    <em>"Trust, but Verify."</em>
                                </p>
                            </div>
                        </div>
                    )
                }
            ]
        },
        // PHASE 2: SCENARIO (Exam)
        {
            phaseId: 'p2_phishing_exam',
            phaseNumber: 2,
            // SYNCED WITH REGISTRY: Operation Inbox Zero
            ...syncScenario('sc_phishing_exam', {
                duration: '20 min',
                difficulty: 'Intermediate'
            }),
            type: 'scenario',
            scenarioId: 'sc_phishing_exam',
            description: 'Live Verification: Manage a simulated inbox under attack. Report threats and process legitimate mail.',
            topics: ['Decision Making', 'Threat Reporting', 'False Positives'],
            icon: <FaFingerprint />
        },
        // PHASE 3: LEARNING (Interactive)
        {
            phaseId: 'p3_social_eng',
            phaseNumber: 3,
            title: 'The Manipulators Playbook',
            type: 'learning',
            duration: '20 min',
            difficulty: 'Intermediate',
            xpReward: 500,
            description: 'Audio & Chat Analysis: Deconstruct real-world social engineering scripts and identify the manipulation technique.',
            topics: ['Vishing', 'Smishing', 'Psychological Triggers'],
            icon: <FaUsers />,
            professor: {
                name: "PROFESSOR CYBERBEARD",
                title: "Academy Instructor // Rank: Grandmaster",
                avatarIcon: <FaUserGraduate />
            },
            lessons: [
                // =========================================================================
                // PART 1: THE PUPPET MASTER (Intro)
                // =========================================================================
                {
                    id: 'intro',
                    title: "The Puppet Master",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-lesson-hero">
                                <div className="cr-hero-icon"><FaUsers /></div>
                                <h2>"HACK THE HUMAN"</h2>
                                <h3 style={{ marginTop: '10px' }}>Social Engineering Fundamentals</h3>
                                <p className="lesson-text">
                                    Firewalls can't stop a phone call. Antivirus can't catch a lie.
                                    <strong>Social Engineering</strong> isn't about code. It's about confidence.
                                </p>
                            </div>

                            <div className="cr-triad-grid">
                                <div className="cr-card-interactive">
                                    <div className="card-icon-header gold"><FaLock /></div>
                                    <h3>CONFIDENCE</h3>
                                    <p>The attacker acts like they belong. If you question them, they act offended.</p>
                                </div>
                                <div className="cr-card-interactive">
                                    <div className="card-icon-header purple"><FaClock /></div>
                                    <h3>URGENCY</h3>
                                    <p>They create a crisis that only YOU can solve... but only if you act RIGHT NOW.</p>
                                </div>
                                <div className="cr-card-interactive">
                                    <div className="card-icon-header red"><FaExclamationTriangle /></div>
                                    <h3>THE SCRIPT</h3>
                                    <p>They have a playbook for every question you ask. They are always one step ahead.</p>
                                </div>
                            </div>
                        </div>
                    )
                },
                // =========================================================================
                // PART 2: THE HALL OF INFAMY - REAL BREACHES
                // =========================================================================
                {
                    id: 'case_studies',
                    title: "The Hall of Infamy: Billion-Dollar Mistakes",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE HALL OF INFAMY"
                                subtitle="Learn from billion-dollar mistakes"
                                icon={<FaExclamationTriangle />}
                                color="#dc2626"
                            />

                            <p className="cr-intro-text">
                                These aren't hypothetical scenarios. These are real attacks that cost real companies millions of dollars and destroyed careers.
                            </p>

                            {/* Case 1: Target (2013) */}
                            <div style={{ marginBottom: '35px', padding: '25px', background: 'rgba(220, 38, 38, 0.1)', border: '2px solid rgba(220, 38, 38, 0.3)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ fontSize: '2em', fontWeight: 'bold' }}>🎯 TARGET</div>
                                        <span style={{ padding: '4px 12px', background: 'rgba(220, 38, 38, 0.3)', borderRadius: '6px', fontSize: '0.85em' }}>2013</span>
                                    </div>
                                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#dc2626' }}>$202M in losses</div>
                                </div>

                                <div style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                                    <strong style={{ color: '#ff4757' }}>Attack Vector:</strong> Phishing email to HVAC contractor
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <h5 style={{ marginBottom: '12px', color: '#dc2626' }}>Timeline of Destruction:</h5>
                                    <div style={{ paddingLeft: '20px', borderLeft: '3px solid #dc2626' }}>
                                        <div style={{ marginBottom: '15px', paddingLeft: '15px' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Day 1:</div>
                                            <div>HVAC vendor employee clicks malicious email attachment containing malware</div>
                                        </div>
                                        <div style={{ marginBottom: '15px', paddingLeft: '15px' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Day 3:</div>
                                            <div>Attackers use vendor credentials to access Target's corporate network</div>
                                        </div>
                                        <div style={{ marginBottom: '15px', paddingLeft: '15px' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Week 2:</div>
                                            <div>Malware installed on 40,000 point-of-sale terminals across stores nationwide</div>
                                        </div>
                                        <div style={{ paddingLeft: '15px' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Month 1:</div>
                                            <div style={{ color: '#ff4757', fontWeight: 'bold' }}>40 million credit card numbers stolen + 70 million customer records compromised</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: '15px', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '8px', borderLeft: '4px solid #00d4ff' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <FaCheckCircle style={{ marginTop: '4px', flexShrink: 0 }} />
                                        <div>
                                            <strong>Lesson:</strong> Third-party vendors are the weakest link.
                                            One subcontractor's employee clicking a phishing email destroyed a Fortune 500 company's reputation and cost them $202M.
                                            The CEO resigned.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Case 2: Twitter (2020) */}
                            <div style={{ marginBottom: '35px', padding: '25px', background: 'rgba(59, 130, 246, 0.1)', border: '2px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ fontSize: '2em', fontWeight: 'bold' }}>𝕏 TWITTER / X</div>
                                        <span style={{ padding: '4px 12px', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '6px', fontSize: '0.85em' }}>2020</span>
                                    </div>
                                    <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#3b82f6' }}>130 verified accounts hijacked</div>
                                </div>

                                <div style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                                    <strong style={{ color: '#3b82f6' }}>Attack Vector:</strong> Phone-based social engineering (Vishing)
                                </div>

                                <div style={{ marginBottom: '20px', lineHeight: '1.7' }}>
                                    <p>Attackers called Twitter employees pretending to be IT support.</p>
                                    <p>They convinced <strong>junior staff</strong> to provide access to internal admin tools using nothing but psychology and confidence.</p>
                                    <br />
                                    <strong>Within hours, they hijacked accounts of:</strong>
                                    <ul style={{ marginTop: '10px', paddingLeft: '20px', lineHeight: '2' }}>
                                        <li>Barack Obama (Former US President)</li>
                                        <li>Elon Musk (Tesla CEO)</li>
                                        <li>Bill Gates (Microsoft Founder)</li>
                                        <li>Apple, Uber, Coinbase, and other major brands</li>
                                    </ul>
                                    <br />
                                    <p>The attackers posted Bitcoin scams from these accounts, stealing over <strong>$120,000</strong> before Twitter regained control.</p>
                                </div>

                                <div style={{ padding: '15px', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '8px', borderLeft: '4px solid #00d4ff' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <FaCheckCircle style={{ marginTop: '4px', flexShrink: 0 }} />
                                        <div>
                                            <strong>Lesson:</strong> No technical exploit was used. No zero-day vulnerability. No malware.
                                            The attackers simply <em>asked</em> for access over the phone, and employees gave it.
                                            Social engineering is the master key to any system.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Case 3: MGM Resorts (2023) */}
                            <div style={{ marginBottom: '20px', padding: '25px', background: 'rgba(234, 179, 8, 0.1)', border: '2px solid rgba(234, 179, 8, 0.3)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ fontSize: '2em', fontWeight: 'bold' }}>🎰 MGM RESORTS</div>
                                        <span style={{ padding: '4px 12px', background: 'rgba(234, 179, 8, 0.3)', borderRadius: '6px', fontSize: '0.85em' }}>2023</span>
                                    </div>
                                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#eab308' }}>$100M+ in losses</div>
                                </div>

                                <div style={{ marginBottom: '15px', padding: '12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
                                    <strong style={{ color: '#eab308' }}>Attack Vector:</strong> 10-minute phone call to Help Desk
                                </div>

                                <div style={{ marginBottom: '20px', lineHeight: '1.7' }}>
                                    <p><strong>The Attack:</strong></p>
                                    <ol style={{ paddingLeft: '20px', lineHeight: '2', marginTop: '10px' }}>
                                        <li>Hackers found an MGM employee's name and job title on LinkedIn</li>
                                        <li>They called the IT help desk claiming to be that employee</li>
                                        <li>They said they "forgot their password"</li>
                                        <li>The help desk <strong style={{ color: '#ff4757' }}>reset the password without proper verification</strong></li>
                                    </ol>
                                    <br />
                                    <div style={{ padding: '15px', background: 'rgba(255, 71, 87, 0.2)', borderRadius: '8px' }}>
                                        <strong style={{ fontSize: '1.1em' }}>Result:</strong>
                                        <ul style={{ marginTop: '10px', paddingLeft: '20px', lineHeight: '2' }}>
                                            <li>Ransomware deployed across entire casino network</li>
                                            <li>Slot machines, room keys, and booking systems offline for <strong>10 days</strong></li>
                                            <li>Casino operating with pen and paper</li>
                                            <li><strong>Total cost: $100M+</strong> in lost revenue and ransomware payment</li>
                                        </ul>
                                    </div>
                                </div>

                                <div style={{ padding: '15px', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '8px', borderLeft: '4px solid #00d4ff' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <FaCheckCircle style={{ marginTop: '4px', flexShrink: 0 }} />
                                        <div>
                                            <strong>Lesson:</strong> A billion-dollar corporation brought to its knees by a 10-minute phone call.
                                            The attackers didn't hack the network—they hacked the help desk employee.
                                            Social engineering is the most dangerous threat vector in cybersecurity.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <FactBox type="warning" title="YOUR ROLE">
                                You are now the last line of defense against these attacks.
                                Every phone call could be vishing. Every email could be phishing. Every "urgent" request could be social engineering.
                                <br /><br />
                                <strong>Your mission:</strong> Question everything. Verify always. Trust the process, not the pressure.
                            </FactBox>
                        </div>
                    )
                },
                // =========================================================================
                // PART 3: VISHING (Voice Phishing)
                // =========================================================================
                {
                    id: 'vishing',
                    title: "Tactical Vishing (Voice)",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaMobileAlt className="section-icon" />
                                <h2>Voice Phishing (Vishing)</h2>
                            </div>

                            <p>
                                Attackers will spoof the Caller ID to look like "Corporate HQ".
                                Below is a transcript of a recorded attack against a Junior Admin.
                            </p>

                            <div className="cr-vishing-console">
                                <div className="console-header">
                                    <span>REC: 04:12</span>
                                    <span>SOURCE: UNKNOWN (SPOOFED)</span>
                                    <span>STATUS: <span style={{ color: '#ff4757' }}>COMPROMISED</span></span>
                                </div>

                                <div className="console-track">
                                    <div className="sound-wave-bar">
                                        {[...Array(20)].map((_, i) => (
                                            <div key={i} className="wave-line" style={{ animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                </div>

                                <div className="transcript-box">
                                    <div className="transcript-line">
                                        <span className="speaker-tag attacker">ATTACKER</span>
                                        "Hi Dave, this is Mike from Network Ops. We're seeing a massive sync error on your workstation."
                                    </div>
                                    <div className="transcript-line">
                                        <span className="speaker-tag victim">VICTIM</span>
                                        "Oh really? Everything seems fine on my end."
                                    </div>
                                    <div className="transcript-line">
                                        <span className="speaker-tag attacker">ATTACKER</span>
                                        "It's silent corruption. <span className="tactic-highlight" data-tooltip="TECHNO-BABBLE PRETEXT">If we don't patch it in 2 minutes</span>, you're going to lose all your data."
                                    </div>
                                    <div className="transcript-line">
                                        <span className="speaker-tag victim">VICTIM</span>
                                        "Whoa, okay. What do I do?"
                                    </div>
                                    <div className="transcript-line">
                                        <span className="speaker-tag attacker">ATTACKER</span>
                                        "Just read me the <span className="tactic-highlight" data-tooltip="CREDENTIAL HARVESTING">6-digit code</span> managed by your Authenticator app. I can force the sync from here."
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                },
                // =========================================================================
                // PART 3: SMISHING (SMS Attacks)
                // =========================================================================
                {
                    id: 'smishing',
                    title: "Smishing (SMS Attacks)",
                    content: (
                        <div className="cr-lesson-container center-aligned">
                            <div className="cr-section-header">
                                <FaExclamationTriangle className="section-icon" />
                                <h2>SMS Deception</h2>
                            </div>

                            <p style={{ marginBottom: '30px' }}>
                                We trust texts more than emails. We shouldn't.
                                Analyze the incoming threat below.
                            </p>

                            <div className="cr-phone-screen">
                                <div className="phone-header-bar">
                                    <span>9:41</span>
                                    <span><FaLock style={{ fontSize: '10px' }} /> 5G</span>
                                </div>
                                <div className="phone-content">
                                    <div className="sms-sender-id">Unknown Sender</div>
                                    <div className="sms-message received">
                                        <strong style={{ color: '#ff4757' }}>URGENT:</strong> Amazon: We detected an unusual sign-in attempt from Beijing, China.
                                    </div>
                                    <div className="sms-message received">
                                        If this wasn't you, click here immediately to lock your account:
                                        <br />
                                        <span style={{ color: '#00d4ff', textDecoration: 'underline' }}>amzn-security-chk.com/lock</span>
                                    </div>
                                    <div className="sms-action-row">
                                        <button className="sms-btn block">BLOCK</button>
                                        <button className="sms-btn verify">VERIFY</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                },
                // =========================================================================
                // PART 4: PRETEXTING SCENARIO
                // =========================================================================
                {
                    id: 'pretexting',
                    title: "The Long Con: Pretexting",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaUserSecret className="section-icon" />
                                <h2>The Art of the Pretext</h2>
                            </div>
                            <p>
                                <strong>Pretexting</strong> is creating a fabricated scenario (a backstory) to steal info.
                                It's not a quick grab; it's a roleplay.
                            </p>

                            <div className="cr-scenario-builder">
                                <div className="scenario-step">
                                    <h4>PHASE 1: Reconnaissance</h4>
                                    <p>Attacker finds the name of your external Audit Firm on your company website.</p>
                                    <div className="scenario-tactic">OSINT Gathering</div>
                                </div>
                                <div className="scenario-step">
                                    <h4>PHASE 2: The Establish</h4>
                                    <p>"Hi, I'm Sarah from the Audit Team. We're doing a surprise compliance check."</p>
                                    <div className="scenario-tactic dark">Authority Pretext</div>
                                </div>
                                <div className="scenario-step">
                                    <h4>PHASE 3: The Ask</h4>
                                    <p>"I need visual confirmation of the server room keycard log. Take a picture and text it to me."</p>
                                    <div className="scenario-tactic dark">Indirect Data Theft</div>
                                </div>
                            </div>
                        </div>
                    )
                },
                // =========================================================================
                // PART 5: MISSION WIRE TAP
                // =========================================================================
                {
                    id: 'final_briefing',
                    title: "Mission: Live Wire Tap",
                    content: (
                        <div className="cr-lesson-container center-aligned">
                            <div className="cr-mission-display">
                                <div className="mission-icon-static"><FaNetworkWired /></div>
                                <h2>MISSION: WIRE TAP</h2>
                                <h4 className="mission-subtitle">ACTIVE INTERCEPT</h4>
                            </div>

                            <div className="cr-mission-brief-grid">
                                <div className="brief-col">
                                    <h5><FaList /> Intel Report</h5>
                                    <p>
                                        We have intercepted a live audio stream targeting our Finance Department.
                                        You are the last line of defense.
                                    </p>
                                </div>
                                <div className="brief-col">
                                    <h5><FaRocket /> Objectives</h5>
                                    <ol>
                                        <li><strong>LISTEN</strong> to the chat transcript.</li>
                                        <li><strong>IDENTIFY</strong> the manipulation tactics.</li>
                                        <li><strong>FLAG</strong> the specific phrases used to trigger panic.</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="cr-final-warning">
                                <p>
                                    <strong>Primary Directive:</strong>
                                    <br />
                                    If you hear them ask for a "Code", "Password", or "Transfer",
                                    <strong>TERMINATE THE CONNECTION</strong>.
                                </p>
                            </div>
                        </div>
                    )
                },

            ]
        },
        // PHASE 4: SCENARIO (Exam)
        {
            phaseId: 'p4_social_exam',
            phaseNumber: 4,
            // SYNCED WITH REGISTRY: The Friendly Stranger
            ...syncScenario('exam_friendly_stranger', {
                title: 'Exam: The Friendly Stranger',
                xpReward: 5000,
                duration: '60 min',
                difficulty: 'Intermediate'
            }),
            type: 'scenario',
            scenarioId: 'exam_friendly_stranger',
            description: 'FINAL EXAM: Trust is the vulnerability. He smiled, and you lost everything. Confront the intruder.',
            topics: ['Social Engineering', 'Physical Breach', 'Crisis Negotiation'],
            icon: <FaNetworkWired />
        }
    ]
};

export default CyberAwareness;
