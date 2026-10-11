import React from 'react';
import {
    FaUserSecret, FaShieldAlt, FaBug, FaNetworkWired, FaMobileAlt,
    FaDoorOpen, FaUsb, FaBinoculars, FaBrain, FaLock, FaExclamationTriangle,
    FaFingerprint, FaIdCard, FaBullseye, FaMask, FaGlobe, FaSkull, FaCheckDouble, FaRocket,
    FaGhost, FaSatellite, FaSimCard, FaWifi, FaUserTie, FaLaptopCode, FaCogs, FaClipboardList, FaList, FaHandshake, FaBolt, FaRunning,
    FaEnvelope, FaMicrophone, FaSignal, FaHeart, FaCoins, FaVideo // Added for new lessons
} from 'react-icons/fa';
import { ConceptCard, FactBox, HeroSection } from '../../features/training/components/TrainingUI';
import { getScenarioById } from '../ScenarioRegistry';
import '../../features/training/styles/SocialEngineeringOps.css'; // Keep for custom usage if any

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

// --- ENHANCED CONTENT COMPONENTS ---
// Removed internal definitions. Using shared TrainingUI components.

const SocialEngineeringOps = {
    id: 'social-engineering-ops',
    title: 'Social Engineering Ops',
    category: 'Advanced Defense',
    icon: <FaUserSecret />,
    color: '#ff4757',
    image: '/images/course-social-ops.png',
    description: 'Advanced Counter-Intelligence Training. Learn the tradecraft of threat actors, from high-stakes vishing to physical breaches. No fluff. Pure Ops.',
    businessValue: 'Transforms employees into active counter-surveillance assets. Mitigates high-level targeted attacks (APT).',
    targetAudience: 'High-Value Targets, SysAdmins, Finance',
    certificateName: 'SE Counter-Ops Badge',

    outcomes: [
        'Deconstruct complex multi-stage social engineering operations',
        'Identify and neutralize "Amygdala Hijack" attempts',
        'Detect deepfake audio and AI-driven vishing attacks',
        'Execute "Pivot & Verify" protocols under pressure'
    ],

    roi: {
        riskReduction: '98%',
        avgIncidentCost: 'Avoided $7.2M',
        timeToValue: 'Immediate',
        complianceStandards: ['NIST 800-53', 'ISO 27002']
    },

    phases: [
        // =========================================================================
        // MODULE 1: THE HACKER'S PLAYBOOK
        // =========================================================================
        {
            phaseId: 'se_p1_playbook',
            phaseNumber: 1,
            title: 'Module 1: The Hacker’s Playbook',
            type: 'learning',
            duration: '45 min',
            difficulty: 'Intermediate',
            xpReward: 800,
            description: 'The Anatomy of a Heist. Dissecting the 6 phases of a professional social engineering operation.',
            topics: ['Reconnaissance', 'Pretexting', 'Exploitation', 'OSINT'],
            icon: <FaBinoculars />,
            professor: {
                name: "Operative Zero",
                title: "Red Team Lead",
                avatarIcon: <FaUserSecret />
            },
            lessons: [
                {
                    id: 'mod1_intro',
                    title: "The Kill Chain: Overview",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE HACK IS A CAMPAIGN"
                                subtitle="Civilians think a hack happens in a second. In reality, it is a slow-burn operation. You are being surveilled log before the attack."
                                icon={<FaUserSecret />}
                                color="#ff4757"
                            />

                            <div className="cr-content-block">
                                <h3 style={{ color: "#ff4757", textTransform: "uppercase", borderBottom: "1px solid #ff4757", paddingBottom: "10px" }}>
                                    The 6 Phases of the Operation
                                </h3>
                                <p>
                                    Professional Threat Actors (APTs) follow a methodical process. Understanding this "Kill Chain" allows you to disrupt the attack at any stage.
                                </p>

                                <div className="cr-grid-2">
                                    <ConceptCard
                                        icon={<FaBinoculars />}
                                        title="Phase 1: Reconnaissance"
                                        description="The 'Stalk'. Collecting OSINT (Open Source Intelligence) from LinkedIn, Instagram, and Corporate Meta-data."
                                        color="#ff4757"
                                    />
                                    <ConceptCard
                                        icon={<FaBullseye />}
                                        title="Phase 2: Targeting"
                                        description="The 'Selection'. Identifying the weakest link in the organization (usually an Assistant or New Hire)."
                                        color="#ff4757"
                                    />
                                    <ConceptCard
                                        icon={<FaMask />}
                                        title="Phase 3: Pretexting"
                                        description="The 'Story'. Creating a believable cover identity (e.g., IT Support, Vendor, Auditor) to justify contact."
                                        color="#ff4757"
                                    />
                                    <ConceptCard
                                        icon={<FaHandshake />}
                                        title="Phase 4: Trust Building"
                                        description="The 'Hook'. Establishing rapport using psychological triggers like urgency, authority, or helpfulness."
                                        color="#ff4757"
                                    />
                                    <ConceptCard
                                        icon={<FaBolt />}
                                        title="Phase 5: Exploitation"
                                        description="The 'Breach'. The moment the victim hands over the keys (password, MFA code, or access)."
                                        color="#ff4757"
                                    />
                                    <ConceptCard
                                        icon={<FaRunning />}
                                        title="Phase 6: The Exit"
                                        description="The 'Ghost'. Disconnecting, covering tracks, and maintaining the backdoor for future access."
                                        color="#ff4757"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod1_recon_deep',
                    title: "Deep Dive: Reconnaissance (OSINT)",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="PHASE 1: THE DIGITAL FOOTPRINT"
                                icon={<FaSatellite />}
                                color="#00d4ff"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Before an attacker ever emails you, they know who you are. The internet never forgets, and you feed the database every day.
                                </p>

                                <h3 style={{ color: '#00d4ff', marginTop: '30px' }}>Target: YOU</h3>
                                <ul style={{ marginBottom: '20px' }}>
                                    <li><strong>Mother's Maiden Name:</strong> Found on ancestry sites or old Facebook posts.</li>
                                    <li><strong>Pet's Name:</strong> "Rex is such a good boy!" (Instagram Stories).</li>
                                    <li><strong>Manager's Name:</strong> "Congrats to my boss @Name on the promotion!" (LinkedIn).</li>
                                    <li><strong>Email Format:</strong> Verified via Hunter.io or similar email scrapers.</li>
                                </ul>

                                <FactBox title="Toolbox: OSINT" type="info">
                                    Hackers use tools like <strong>Maltego</strong> (relationship mapping) and <strong>Shodan</strong> (IoT scanner) to map out your digital life.
                                    They don't guess passwords; they profile you until they can reset them because they know the answers to your security questions.
                                </FactBox>

                                <h3 style={{ marginTop: '30px', color: '#00d4ff' }}>The "Out of Office" Vulnerability</h3>
                                <p>
                                    Setting an OOO reply is standard procedure, but it is a goldmine for attackers.
                                </p>
                                <div style={{ background: '#111', padding: '15px', borderLeft: '4px solid #ff4757', fontFamily: 'monospace' }}>
                                    "I am out of the office until Jan 15th. For urgent matters, please contact my assistant, Sarah, at sarah@company.com or call 555-0192."
                                </div>
                                <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#888' }}>
                                    <strong>Attacker Analysis:</strong> Now I know you are gone (opportunity), I know your assistant's name (target), and her direct line. I will call Sarah posing as you, claiming I lost my phone on vacation and need immediate access.
                                </p>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod1_psych_hijack',
                    title: "Deep Dive: The Amygdala Hijack",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="HACKING THE BRAIN"
                                icon={<FaBrain />}
                                color="#ff4757"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Attackers don't just hack computers; they hack biology. The human brain has a vulnerability: <strong>The Fight or Flight Response</strong>.
                                </p>

                                <div className="cr-grid-2">
                                    <div style={{ background: '#1f2937', padding: '20px', borderRadius: '12px' }}>
                                        <h4 style={{ color: '#ff4757', marginTop: 0 }}>The Mechanism</h4>
                                        <p>
                                            When the <strong>Amygdala</strong> (Threat Center) is activated by Fear or Urgency, it chemically disconnects the <strong>Prefrontal Cortex</strong> (Logic Center).
                                        </p>
                                    </div>
                                    <div style={{ background: '#1f2937', padding: '20px', borderRadius: '12px' }}>
                                        <h4 style={{ color: '#ff4757', marginTop: 0 }}>The Result</h4>
                                        <p>
                                            You physically cannot think critically. You operate on instinct. Attackers artificially induce this state to bypass your skepticism.
                                        </p>
                                    </div>
                                </div>

                                <FactBox title="The Cognitive Load Exploit" type="danger">
                                    <strong>Formula:</strong> <code>High Stakes + Short Timeframe = Rational Shutdown.</code>
                                    <br />
                                    If a message says "ACT NOW OR LOSE X", it is an exploit payload targeting your brain chemistry.
                                </FactBox>

                                <h3 style={{ marginTop: '30px' }}>Symptoms of a Hijack</h3>
                                <ul style={{ color: '#ccc' }}>
                                    <li>Sudden elevated heart rate</li>
                                    <li>Feeling of "Tunnel Vision" or fixation on the problem</li>
                                    <li>Urge to "just get it done" to relieve the anxiety</li>
                                    <li>Fear of authority or consequences</li>
                                </ul>
                                <p style={{ marginTop: '20px', fontWeight: 'bold', color: '#ff4757' }}>
                                    TACTICAL RESPONSE: If you feel the "Hijack", put the phone down. Take 3 deep breaths. Wait 60 seconds. The logic center will reboot.
                                </p>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod1_pretexting_deep',
                    title: "Deep Dive: Advanced Pretexting",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE ART OF THE LURE"
                                icon={<FaMask />}
                                color="#a855f7"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Pretexting is more than just lying. It is character acting. The attacker builds a Scenario where you <strong>want</strong> to help them.
                                </p>

                                <h3 style={{ color: '#a855f7' }}>Common Archetypes</h3>
                                <div className="cr-grid-2">
                                    <ConceptCard
                                        icon={<FaUserTie />}
                                        title="The Distressed Executive"
                                        description="'I'm about to step into a board meeting and my login is failing! Fix it NOW or it's your head!' (Uses Fear/Authority)."
                                        color="#a855f7"
                                    />
                                    <ConceptCard
                                        icon={<FaCogs />}
                                        title="The Helpful Technician"
                                        description="'Hi, we noticed your computer is running slow. I'm just calling to optimize your drivers.' (Uses Reciprocity)."
                                        color="#a855f7"
                                    />
                                </div>

                                <h3 style={{ color: '#a855f7', marginTop: '30px' }}>The Trust Ladder</h3>
                                <p>
                                    Sophisticated attackers don't ask for the password immediately. They climb the ladder:
                                </p>
                                <ol style={{ lineHeight: '1.8', background: '#111', padding: '20px' }}>
                                    <li><strong>The Small Ask:</strong> "Can you just confirm your email address?" (You say 'Yes').</li>
                                    <li><strong>The Verification:</strong> "Okay, I see you in the system." (Validation).</li>
                                    <li><strong>The Problem:</strong> "Oh, I see a sync error here." (Creating fake conflict).</li>
                                    <li><strong>The Big Ask:</strong> "I need you to read the code on your phone to fix it." (Exploitation).</li>
                                </ol>
                                <FactBox title="The 'Yes' Trap" type="warning">
                                    Psychologically, once you have said 'Yes' to small requests, you are 80% more likely to agree to a big request. Disengage early.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod1_mission',
                    title: "Mission Briefing: OP SILENT ECHO",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="MISSION READY"
                                subtitle="You have studied the theory. Now apply it. We have intercepted an active kill chain targeting our organization."
                                icon={<FaCheckDouble />}
                                color="#ff4757"
                            />

                            <div className="cr-content-block">
                                <div className="cr-mission-brief-grid">
                                    <div className="brief-col">
                                        <h5><FaList /> Intel Report</h5>
                                        <p>
                                            <strong>Target:</strong> Finance Department
                                            <br />
                                            <strong>Threat Actor:</strong> SILENT-ECHO (APT Group)
                                            <br />
                                            <strong>Attack Type:</strong> Wire Transfer Fraud / BEC
                                        </p>
                                    </div>
                                    <div className="brief-col">
                                        <h5><FaRocket /> Objectives</h5>
                                        <ul className="cr-objective-list">
                                            <li><FaBinoculars /> <strong>ANALYZE</strong> the attacker's moves in real-time.</li>
                                            <li><FaBrain /> <strong>IDENTIFY</strong> the psychological triggers used.</li>
                                            <li><FaBolt /> <strong>EXECUTE</strong> the next phase to observe the outcome.</li>
                                        </ul>
                                    </div>
                                </div>

                                <FactBox title="Engagement Rules" type="warning">
                                    This is a simulated environment. You will see the attack unfold from the <strong>Attacker's Perspective</strong>.
                                    Study their methodology to defeat them.
                                </FactBox>

                            </div>
                        </div>
                    )
                }
            ]
        },

        // =========================================================================
        // MODULE 2: COMBATTING THE MULTI-CHANNEL ATTACK
        // =========================================================================
        {
            phaseId: 'se_p2_multichannel',
            phaseNumber: 2,
            title: 'Module 2: Multi-Channel Warfare',
            type: 'learning',
            duration: '45 min',
            difficulty: 'Intermediate',
            xpReward: 850,
            description: 'Beyond Email. Combating Vishing, Deepfakes, QR codes, and physical infiltration.',
            topics: ['Vishing', 'AI Clones', 'Quishing', 'Tailgating'],
            icon: <FaNetworkWired />,
            professor: {
                name: "Operative Zero",
                title: "Red Team Lead",
                avatarIcon: <FaUserSecret />
            },
            lessons: [
                {
                    id: 'mod2_vishing_deep',
                    title: "Deep Dive: Vishing & AI Voice",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="VOICE OPS (VISHING)"
                                icon={<FaMobileAlt />}
                                color="#d946ef"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Vishing (Voice Phishing) is the highest success-rate vector because we are conditioned to trust a human voice.
                                </p>

                                <h3 style={{ color: '#d946ef', marginTop: '20px' }}>Technique 1: The AI Clone</h3>
                                <p>
                                    Your boss's voice is not proof of identity anymore.
                                    Generative AI can clone a voice from a 3-second sample (YouTube, Keynote, Podcast) with 95% accuracy.
                                </p>
                                <FactBox title="AI Detection Indicators" type="insane">
                                    <ul>
                                        <li><strong>Lack of Emotion:</strong> AI voices often struggle with "micro-inflections" or emotional variance.</li>
                                        <li><strong>Latency:</strong> Unnatural pauses before responding to complex questions.</li>
                                        <li><strong>Background Noise:</strong> Perfect silence? Real calls have ambient noise. AI is often too clean.</li>
                                    </ul>
                                </FactBox>

                                <h3 style={{ color: '#d946ef', marginTop: '30px' }}>Technique 2: Caller ID Spoofing</h3>
                                <p>
                                    Never trust the number on the screen. VoIP tools allow attackers to display ANY number they want (e.g., "Corporate HQ", "+1 (202) FBI-GOV").
                                </p>
                                <div className="cr-grid-2">
                                    <ConceptCard
                                        icon={<FaMobileAlt />}
                                        title="The Setup"
                                        description="You receive a call. ID says 'IT Help Desk'. The person knows your name and Ticket ID (stolen from email)."
                                        color="#d946ef"
                                    />
                                    <ConceptCard
                                        icon={<FaExclamationTriangle />}
                                        title="The Ask"
                                        description="'We need to re-sync your MFA token. Read me the 6-digit code sent to your phone.'"
                                        color="#d946ef"
                                    />
                                </div>
                                <p><strong>Defense:</strong> The "Callback" Rule. Hang up. Look up the official number. Call them back.</p>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod2_deepfake_video',
                    title: "Deep Dive: Deepfake Video",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE FACE YOU TRUST"
                                subtitle="Seeing is no longer believing. Use the 'Slight Turn' test."
                                icon={<FaVideo />}
                                color="#d946ef"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Attackers are now cloning video feeds in real-time. In a recent incident, a Finance worker paid $25M because she saw her CFO and colleagues on a Zoom call. They were all fake.
                                </p>
                                <div className="cr-grid-2">
                                    <ConceptCard
                                        icon={<FaExclamationTriangle />}
                                        title="The Artifacts"
                                        description="Look for: Weird blinking patterns, lip-sync issues (audio drift), or 'glitching' around the edges of the face/glasses."
                                        color="#d946ef"
                                    />
                                    <FactBox title="The 'Slight Turn' Test" type="insane">
                                        Ask the person to turn their head sideways. Deepfake models often lose tracking on profiles (90-degree angles) and the face will distort or disappear.
                                    </FactBox>
                                </div>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod2_pig_butchering',
                    title: "Pig Butchering (Sha Zhu Pan)",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE LONG CON"
                                subtitle="'Sha Zhu Pan' (Pig Butchering). Fattening the victim before the slaughter."
                                icon={<FaHeart />}
                                color="#ff4757"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Not all attacks happen fast. This scam plays out over months. It usually starts with a "Wrong Number" text.
                                </p>
                                <div className="cr-grid-2">
                                    <ConceptCard
                                        icon={<FaEnvelope />}
                                        title="1. The Grooming"
                                        description="A friendly stranger 'accidentally' texts you. They apologize, then strike up a conversation. They share photos of their 'wealthy lifestyle'."
                                        color="#ff4757"
                                    />
                                    <ConceptCard
                                        icon={<FaCoins />}
                                        title="2. The Investment"
                                        description="They mention a 'special crypto platform' where they make 20% returns. They coach you to invest a small amount ($500). The site shows you made a profit."
                                        color="#ff4757"
                                    />
                                </div>
                                <FactBox title="The Slaughter" type="danger">
                                    You invest your life savings ($50k+). The site disappears. The friend disappears. The money was never invested; it went straight to the cartel's wallet.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod2_physical_deep',
                    title: "Deep Dive: Physical & USB Ops",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="KINETIC BREACHES"
                                icon={<FaDoorOpen />}
                                color="#eab308"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Why hack a firewall when you can just walk through the front door?
                                </p>

                                <h3 style={{ color: '#eab308' }}>Reflexive Compliance</h3>
                                <p>
                                    Humans are trained to be polite. Attackers weaponize this.
                                </p>
                                <ConceptCard
                                    icon={<FaDoorOpen />}
                                    title="The Two-Coffee Rule"
                                    description="An attacker approaches the secure door with two full coffees and a box of donuts. They look helpless. You hold the door. You just compromised the facility."
                                    color="#eab308"
                                />

                                <h3 style={{ marginTop: '30px', color: '#eab308' }}>The Judas Drive (USB Baiting)</h3>
                                <p>
                                    USB Drives are not storage; they are Keyboards.
                                </p>
                                <FactBox title="Rubber Ducky Attack" type="warning">
                                    A "Rubber Ducky" is a hacking tool that looks like a USB drive. When plugged in, it tells the computer "I am a keyboard" and types malicious commands at 1000 WPM.
                                    <br /><br />
                                    <strong>Target:</strong> "Salaries.xlsx" or "Layoff_List.pdf" left in the parking lot.
                                    <br />
                                    <strong>Result:</strong> Full Reverse Shell in 5 seconds.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod2_quishing_deep',
                    title: "Deep Dive: Quishing (QR Phishing)",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE SILENT REDIRECT"
                                icon={<FaBug />}
                                color="#f472b6"
                            />
                            <div className="cr-content-block">
                                <p>
                                    QR Codes are just URLs in a dress. But they are dangerous because they bridge the Physical and Digital worlds, bypassing traditional security perimeters.
                                </p>

                                <div className="cr-grid-2">
                                    <ConceptCard
                                        icon={<FaShieldAlt />}
                                        title="The SEG Bypass"
                                        description="Secure Email Gateways (SEGs) scan text for bad links. They often cannot 'read' a QR code image attachment. It slips right into your Inbox."
                                        color="#f472b6"
                                    />
                                    <ConceptCard
                                        icon={<FaMobileAlt />}
                                        title="The Device Shift"
                                        description="You scan with your Personal Phone. This device typically lacks the corporate endpoint protection (EDR) that your laptop has."
                                        color="#f472b6"
                                    />
                                </div>

                                <h3 style={{ marginTop: '20px', color: '#f472b6' }}>Common Vectors</h3>
                                <ul>
                                    <li><strong>Parking Meters:</strong> Fake stickers placed over real payment codes.</li>
                                    <li><strong>2FA Enrollments:</strong> HR emails asking you to "Update 2FA" via a QR code.</li>
                                    <li><strong>Conference Flyers:</strong> "Scan to win an iPad" interactions.</li>
                                </ul>

                                <FactBox title="Defense Protocol" type="danger">
                                    1. Inspect the URL preview on your camera BEFORE tapping.<br />
                                    2. Never log in to a site reached via QR.<br />
                                    3. Treat stickers in public spaces as "Tampered" by default.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod2_browser_attacks',
                    title: "Advanced: Browser-in-Browser",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE FAKE WINDOW"
                                icon={<FaLaptopCode />}
                                color="#ff4757"
                            />
                            <div className="cr-content-block">
                                <p>
                                    You click "Login with Microsoft". A popup window appears. It looks perfect. The URL bar says "microsoft.com".
                                    <br /><br />
                                    <strong>It is a lie.</strong>
                                </p>
                                <FactBox title="The BiB Attack" type="danger">
                                    Browser-in-the-Browser (BiB) attacks render a fake popup window entirely inside the webpage using HTML/CSS.
                                    The "URL Bar" you see is just a picture drawn by the hacker. You are not on microsoft.com; you are still on the attacker's site.
                                </FactBox>
                                <p style={{ marginTop: '20px' }}>
                                    <strong>How to Spot it:</strong> Try to drag the popup window outside the edge of your browser. A real window can leave the browser. A fake window (BiB) will get stuck at the edge.
                                </p>
                            </div>
                        </div>
                    )
                }
                ,
                {
                    id: 'mod2_mission',
                    title: "Mission Briefing: OP NIGHTSHADE",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="TRIAD ASSAULT"
                                subtitle="Target hardened against email? Fine. We will hit them on every channel they own."
                                icon={<FaNetworkWired />}
                                color="#d946ef"
                            />

                            <div className="cr-content-block">
                                <div className="cr-mission-brief-grid">
                                    <div className="brief-col">
                                        <h5 style={{ color: '#d946ef' }}><FaList /> Intel Report</h5>
                                        <p>
                                            <strong>Target:</strong> CEO (High Value)
                                            <br />
                                            <strong>Defenses:</strong> Email Filters (Strong), MFA (Active)
                                            <br />
                                            <strong>Weakness:</strong> Public Voice Data
                                        </p>
                                    </div>
                                    <div className="brief-col">
                                        <h5 style={{ color: '#d946ef' }}><FaRocket /> Objectives</h5>
                                        <ul className="cr-objective-list">
                                            <li><FaEnvelope /> <strong>E-MAIL:</strong> Bypass Initial Filters</li>
                                            <li><FaMobileAlt /> <strong>SMS:</strong> Intercept 2FA Code</li>
                                            <li><FaMicrophone /> <strong>VOICE:</strong> Deepfake Authorization</li>
                                        </ul>
                                    </div>
                                </div>

                                <FactBox title="Engagement Rules" type="insane">
                                    You are initiating a <strong>Synchronized Multi-Channel Attack</strong>. Timing is everything.
                                    If you delay between vectors, the target will become suspicious.
                                </FactBox>
                            </div>
                        </div>
                    )
                }
            ]
        },

        // =========================================================================
        // MODULE 3: THE HUMAN FIREWALL
        // =========================================================================
        {
            phaseId: 'se_p3_firewall',
            phaseNumber: 3,
            title: 'Module 3: The Human Firewall',
            type: 'learning',
            duration: '35 min',
            difficulty: 'Intermediate',
            xpReward: 800,
            description: 'Hardening the Target. Protocols for verification, confrontation, and reporting.',
            topics: ['Pivot & Verify', 'Verbal Judo', 'Reporting Culture'],
            icon: <FaShieldAlt />,
            professor: {
                name: "Operative Zero",
                title: "Red Team Lead",
                avatarIcon: <FaUserSecret />
            },
            lessons: [
                {
                    id: 'mod3_protocols',
                    title: "Protocol: Pivot & Verify",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="DEFENSIVE PROTOCOLS"
                                subtitle="When in doubt, hang up and look up."
                                icon={<FaShieldAlt />}
                                color="#4f46e5"
                            />
                            <div className="cr-content-block">
                                <p>
                                    You need a pre-loaded response for high-pressure situations. We call this the "Pivot".
                                </p>
                                <div style={{
                                    background: "#1f2937",
                                    padding: "20px",
                                    borderRadius: "12px",
                                    borderLeft: "4px solid #4f46e5",
                                    marginBottom: "20px"
                                }}>
                                    <h3 style={{ color: '#4f46e5', marginTop: 0 }}>The Verbal Script</h3>
                                    <p>
                                        <strong>Attacker:</strong> "I need this done NOW! The CEO is waiting!"
                                    </p>
                                    <p>
                                        <strong>You:</strong> "I understand the urgency, and I want to help you. However, for your security and mine, I must follow the verification procedure for all unexpected requests. I will call you back on your internal extension in 2 minutes."
                                    </p>
                                </div>

                                <h3 style={{ color: '#4f46e5' }}>The 3-Step Loop</h3>
                                <ol style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
                                    <li><strong>The Pivot:</strong> Empathize ("I want to help") then Block ("But I must follow rules").</li>
                                    <li><strong>The Hangup:</strong> Disconnect locally. Do not trust the inbound line.</li>
                                    <li><strong>The Verify:</strong> Call the employee back on a KNOWN internal extension (from Intranet/Directory).</li>
                                </ol>

                                <FactBox title="Why Empathy?" type="info">
                                    Attackers expect resistance. They don't expect helpfulness combined with rigid security. It disrupts their script. If it is a real executive, they will appreciate the security check.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod3_culture_deep',
                    title: "Culture: The Vibe Check",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE VIBE CHECK"
                                icon={<FaFingerprint />}
                                color="#2ecc71"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Your subconscious notices things your conscious mind misses. We call these "Pre-Attack Indicators".
                                </p>

                                <div className="cr-grid-2">
                                    <ConceptCard
                                        icon={<FaHandshake />}
                                        title="1. Forced Teaming"
                                        description="'We're in this together.' 'Let's fix this before the boss finds out.'"
                                        color="#2ecc71"
                                    />
                                    <ConceptCard
                                        icon={<FaHeart />}
                                        title="2. Charm / Flattery"
                                        description="'You're the only one smart enough to help me.' (Ego Bait)"
                                        color="#2ecc71"
                                    />
                                    <ConceptCard
                                        icon={<FaLock />}
                                        title="3. Isolation"
                                        description="'Don't tell Finance just yet.' 'Keep this between us.'"
                                        color="#2ecc71"
                                    />
                                    <ConceptCard
                                        icon={<FaMask />}
                                        title="4. Typecasting"
                                        description="'I didn't think you'd be helpful.' (Trying to make you prove them wrong)."
                                        color="#2ecc71"
                                    />
                                </div>

                                <FactBox title="Report Everything" type="insane">
                                    A "Failed" attack is still an attack. Intelligence is only useful if shared.
                                    <br /><br />
                                    <strong>"See Something, Say Something"</strong> isn't just a slogan; it's the only way to burn the attacker's infrastructure. If you report the email, IT can block that sender for the entire company in seconds.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod3_war_stories',
                    title: "War Stories: Declassified",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="FROM THE TRENCHES"
                                icon={<FaClipboardList />}
                                color="#f59e0b"
                            />
                            <div className="cr-content-block">
                                <p>Real-world examples of attacks that succeeded and why.</p>

                                <h3 style={{ color: '#f59e0b', marginTop: '20px' }}>Case Study: The Casino Fish Tank</h3>
                                <p>
                                    <strong>Target:</strong> A major Las Vegas Casino.<br />
                                    <strong>Vector:</strong> IoT Thermostat.<br />
                                    <strong>Attack:</strong> Hackers accessed the smart thermostat in the lobby fish tank. From there, they pivoted to the internal network and stole the High Roller database.
                                    <br />
                                    <strong>Lesson:</strong> Everything connected to the net is an entry point.
                                </p>

                                <h3 style={{ color: '#f59e0b', marginTop: '20px' }}>Case Study: The $100M Deepfake</h3>
                                <p>
                                    <strong>Target:</strong> A multinational finance firm in Hong Kong.<br />
                                    <strong>Vector:</strong> Video Conference Call.<br />
                                    <strong>Attack:</strong> An employee was invited to a video call with the CFO and several other colleagues. EVERYONE on the call except the victim was a Deepfake video loop. They instructed him to transfer $25M. He did.
                                    <br />
                                    <strong>Lesson:</strong> Seeing is no longer believing.
                                </p>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod3_mission',
                    title: "Mission Briefing: VOICE OPS",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-lesson-hero" style={{ background: '#0c0a09', borderBottom: '4px solid #10b981' }}>
                                <div className="cr-hero-icon" style={{ color: "#10b981", borderColor: "#10b981" }}>
                                    <FaMicrophone />
                                </div>
                                <h2 style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "2px", color: '#10b981' }}>
                                    OPERATION: CASANOVA
                                </h2>
                                <p className="lesson-text">
                                    The target's firewall is human. Talk your way through it.
                                </p>
                            </div>

                            <div className="cr-content-block">
                                <div className="cr-mission-brief-grid">
                                    <div className="brief-col">
                                        <h5 style={{ color: '#10b981' }}><FaList /> Target Profile</h5>
                                        <p>
                                            <strong>Target:</strong> Sarah (Executive Reception)
                                            <br />
                                            <strong>Traits:</strong> Vigilant, Polite, Rule-Follower
                                            <br />
                                            <strong>Goal:</strong> Transfer call to CEO (Mr. Sterling)
                                        </p>
                                    </div>
                                    <div className="brief-col">
                                        <h5 style={{ color: '#10b981' }}><FaRocket /> Tactics</h5>
                                        <ul className="cr-objective-list">
                                            <li><FaUserSecret /> <strong>Social Engineering:</strong> Pivot & Redirect</li>
                                            <li><FaSignal /> <strong>Voice Analysis:</strong> Monitor Suspicion Levels</li>
                                            <li><FaLock /> <strong>Win Condition:</strong> Trust &gt; 80%</li>
                                        </ul>
                                    </div>
                                </div>

                                <FactBox title="Live Simulation" type="insane">
                                    This is a <strong>real-time voice operations console</strong>.
                                    If you are too aggressive, she will hang up. If you are too vague, she will block you.
                                    <br /><br />
                                    <strong>Find the balance.</strong>
                                </FactBox>
                            </div>
                        </div>
                    )
                }
            ]
        },

        // =========================================================================
        // EXAM: THE GAUNTLET
        // =========================================================================
        {
            phaseId: 'se_p4_exam',
            phaseNumber: 4,
            ...syncScenario('sc_social_engineering_exam', {
                title: 'EXAM: THE GAUNTLET',
                xpReward: 1000,
                duration: '45 min',
                difficulty: 'Intermediate'
            }),
            type: 'scenario',
            scenarioId: 'sc_social_engineering_exam',
            description: '10 High-Stakes Scenarios. One mistake equals compromise. Test your OPS awareness.',
            topics: ['Scenario Analysis', 'Tactical Response'],
            icon: <FaRocket />
        }
    ]
};

export default SocialEngineeringOps;
