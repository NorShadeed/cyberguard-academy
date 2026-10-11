import React from "react";
import {
    FaKey,
    FaLock,
    FaShieldAlt,
    FaUserSecret,
    FaFingerprint,
    FaClock,
    FaCheckDouble,
    FaExclamationTriangle,
    FaUserNinja,
    FaMobileAlt,
    FaBrain,
    FaHome,
    FaDoorOpen,
    FaMedal,
    FaStar,
    FaList,
    FaHistory,
    FaUserTie,
    FaBuilding,
    FaGlobe,
    FaSkull,
    FaBiohazard,
    FaRadiation,
    FaRobot,
    FaGhost,
    FaKeyboard,
    FaIdCard,
    FaUserInjured,
    FaThumbsDown,
    FaCheckCircle,
    FaMusic,
    FaEnvelope,
    FaSearch,
    FaDatabase,
    FaClipboardCheck,
    FaRocket,
} from "react-icons/fa";
import Phase1Detective from "../../components/simulations/password_mastery/Phase1Detective";
import { getScenarioById } from "../ScenarioRegistry";

// Helper to sync with Scenario Registry
const syncScenario = (id, fallback) => {
    const source = getScenarioById(id);
    if (!source) return fallback;
    return {
        ...fallback,
        title: source.title || fallback.title,
        xpReward: source.xp || source.xpReward || fallback.xpReward,
        duration: source.time || source.duration || fallback.duration,
        difficulty: source.difficulty || fallback.difficulty,
    };
};

// --- ENHANCED CONTENT COMPONENTS ---
const ConceptCard = ({
    icon,
    title,
    description,
    color = "#00d4ff",
    borderColor,
}) => (
    <div
        className="cr-concept-card"
        style={{
            background: `linear-gradient(135deg, rgba(20,20,30,0.95), rgba(5,5,10,0.98))`,
            padding: "25px",
            borderRadius: "16px",
            border: `1px solid ${borderColor || color}40`,
            borderLeft: `6px solid ${color}`,
            marginBottom: "20px",
            boxShadow: `0 10px 30px -10px ${color}20`,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
        }}
    >
        <div
            style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "100px",
                background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
                pointerEvents: "none",
            }}
        />
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "15px",
            }}
        >
            <div
                style={{
                    fontSize: "1.8rem",
                    color: color,
                    filter: `drop-shadow(0 0 10px ${color}60)`,
                }}
            >
                {icon}
            </div>
            <h3
                style={{
                    color: "#fff",
                    fontSize: "1.2rem",
                    margin: 0,
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                }}
            >
                {title}
            </h3>
        </div>
        <p
            style={{
                color: "#b0b3b8",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                margin: 0,
            }}
        >
            {description}
        </p>
    </div>
);

const FactBox = ({ title, children, type = "info" }) => {
    const styles = {
        info: { color: "#00d4ff", icon: <FaGlobe /> },
        warning: { color: "#eab308", icon: <FaExclamationTriangle /> },
        danger: { color: "#ff4757", icon: <FaSkull /> },
        success: { color: "#2ecc71", icon: <FaCheckDouble /> },
        insane: { color: "#d946ef", icon: <FaRadiation /> },
    };
    const style = styles[type] || styles.info;

    return (
        <div
            style={{
                background: `linear-gradient(to right, ${style.color}10, transparent)`,
                border: `1px solid ${style.color}40`,
                borderLeft: `4px solid ${style.color}`,
                borderRadius: "8px",
                padding: "20px",
                marginTop: "25px",
                position: "relative",
            }}
        >
            <strong
                style={{
                    color: style.color,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    fontSize: "0.9rem",
                    letterSpacing: "1px",
                }}
            >
                {style.icon} {title.toUpperCase()}
            </strong>
            <div style={{ color: "#e2e8f0", fontSize: "1rem", lineHeight: "1.6" }}>
                {children}
            </div>
        </div>
    );
};

const PasswordMastery = {
    id: "password-mastery",
    title: "Password Mastery: The Human Firewall",
    category: "Corporate Defense",
    icon: <FaKey />,
    color: "#34d399",
    image: "/images/course-password-pixel.png",
    description:
        "Stop making it easy for hackers. Learn the simple tricks to lock down your accounts and keep your digital life safe.",
    businessValue:
        "Proactive Defense: Prevents common hacks like password guessing and phishing.",
    targetAudience: "All Employees (Beginner Friendly)",
    certificateName: "Security Champion Badge",

    outcomes: [
        "Create passwords that remain secure but are easy to remember",
        "Use 2-Step Verification to stop hackers cold",
        'Spot "Fake" emails instantly',
        "Clean up your digital footprint",
    ],

    roi: {
        riskReduction: "High",
        avgIncidentCost: "$150k (Avg Ransom)",
        timeToValue: "Immediate",
        complianceStandards: ["Security Best Practices"],
    },

    phases: [
        // =========================================================================
        // PHASE 1: THE WHY - PSYCHOLOGY & PRICE OF A LEAK
        // =========================================================================

        {
            phaseId: "pm_p1_psychology",
            phaseNumber: 1,
            title: "Module 1: How Hackers & Scammers Work",
            type: "learning",
            duration: "15 min",
            difficulty: "Beginner",
            xpReward: 500,
            description:
                "Why do they want your account? And how do they get it? It is easier than you think.",
            topics: ["Scammers", "Reusing Passwords", "Public Info"],
            icon: <FaBrain />,
            professor: {
                name: "The Insider",
                title: "Security Guide",
                avatarIcon: <FaUserSecret />,
            },
            lessons: [
                // LESSON 1: ANATOMY OF A HACK
                {
                    id: "mod1_anatomy",
                    title: "The Top 3 Tricks",
                    content: (
                        <div className="cr-lesson-container">
                            <div
                                className="cr-lesson-hero"
                                style={{
                                    background: "linear-gradient(to bottom, #000000, #450a0a)",
                                    borderBottom: "4px solid #ff4757",
                                }}
                            >
                                <div
                                    className="cr-hero-icon"
                                    style={{ color: "#ff4757", borderColor: "#ff4757" }}
                                >
                                    <FaSkull />
                                </div>
                                <h2
                                    style={{
                                        fontFamily: "Orbitron, sans-serif",
                                        letterSpacing: "2px",
                                    }}
                                >
                                    THEY DON'T "HACK"
                                </h2>
                                <p className="lesson-text">
                                    They don't need to be geniuses. They assume you are lazy.
                                </p>
                            </div>

                            <div className="cr-content-block">
                                <h3
                                    style={{
                                        color: "#ff4757",
                                        textTransform: "uppercase",
                                        borderBottom: "1px solid #ff4757",
                                        paddingBottom: "10px",
                                    }}
                                >
                                    The 3 Ways They Break In
                                </h3>

                                <div className="cr-grid-3">
                                    <ConceptCard
                                        icon={<FaBiohazard />}
                                        title="Password Reuse"
                                        description="You use the same password for Netflix and your Bank. If they hack Netflix, they have your Bank."
                                        color="#ff4757"
                                    />
                                    <ConceptCard
                                        icon={<FaUserNinja />}
                                        title="Easy Guesses"
                                        description="Using 'Password123' or your dog's name? Computers can guess that in less than 1 second."
                                        color="#f97316"
                                    />
                                    <ConceptCard
                                        icon={<FaGhost />}
                                        title="Phishing"
                                        description="They send a fake email saying 'Account Lock'. You click, you login, and you just gave them your password."
                                        color="#a855f7"
                                    />
                                </div>
                            </div>
                        </div>
                    ),
                },
                // LESSON 2: DIGITAL DOMINO
                {
                    id: "mod1_domino",
                    title: "The Domino Effect",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaHistory
                                    className="section-icon"
                                    style={{ color: "#eab308" }}
                                />
                                <h2>ONE FALLS, ALL FALL</h2>
                            </div>

                            <div className="cr-content-block">
                                <p>
                                    Most people have one "Master Key" password they use
                                    everywhere.
                                    <br />
                                    <br />
                                    <strong>This is a disaster waiting to happen.</strong>
                                </p>

                                <div
                                    style={{
                                        background: "#111",
                                        padding: "30px",
                                        borderRadius: "20px",
                                        border: "1px solid #333",
                                        textAlign: "center",
                                    }}
                                >
                                    <h3
                                        style={{
                                            color: "#eab308",
                                            fontSize: "1.5rem",
                                            marginBottom: "30px",
                                        }}
                                    >
                                        THE CHAIN REACTION
                                    </h3>

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "15px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: "20px",
                                                background: "#222",
                                                borderRadius: "10px",
                                                width: "150px",
                                            }}
                                        >
                                            <FaMusic style={{ fontSize: "2rem", color: "#1db954" }} />
                                            <div style={{ marginTop: "10px" }}>
                                                Hackers steal Spotify Info
                                            </div>
                                        </div>
                                        <div style={{ fontSize: "2rem", color: "#666" }}>➔</div>
                                        <div
                                            style={{
                                                padding: "20px",
                                                background: "#222",
                                                borderRadius: "10px",
                                                width: "150px",
                                            }}
                                        >
                                            <FaKey style={{ fontSize: "2rem", color: "#fff" }} />
                                            <div style={{ marginTop: "10px" }}>
                                                Try same password on Email
                                            </div>
                                        </div>
                                        <div style={{ fontSize: "2rem", color: "#666" }}>➔</div>
                                        <div
                                            style={{
                                                padding: "20px",
                                                background: "#450a0a",
                                                borderRadius: "10px",
                                                width: "180px",
                                                border: "1px solid #ff4757",
                                            }}
                                        >
                                            <FaSkull style={{ fontSize: "2rem", color: "#ff4757" }} />
                                            <div
                                                style={{
                                                    marginTop: "10px",
                                                    color: "#ff4757",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                GAME OVER
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <FactBox title="The Main Rule" type="danger">
                                    Your EMAIL is the most important account. If they get into
                                    your email, they can reset the password for every other
                                    account you own.
                                </FactBox>
                            </div>
                        </div>
                    ),
                },
                // LESSON 3: UNDERGROUND ECONOMY
                {
                    id: "mod1_economy",
                    title: "What is your data worth?",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaGlobe
                                    className="section-icon"
                                    style={{ color: "#00d4ff" }}
                                />
                                <h2>THE BLACK MARKET</h2>
                            </div>

                            <div className="cr-content-block">
                                <p>
                                    Hackers share and sell stolen passwords on the "Dark Web" just
                                    like an online store.
                                </p>

                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        marginTop: "20px",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    <thead style={{ background: "#222", color: "#00d4ff" }}>
                                        <tr>
                                            <th style={{ padding: "15px", textAlign: "left" }}>
                                                ITEM
                                            </th>
                                            <th style={{ padding: "15px", textAlign: "right" }}>
                                                PRICE
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ color: "#ccc" }}>
                                        <tr style={{ borderBottom: "1px solid #333" }}>
                                            <td style={{ padding: "15px" }}>
                                                Stolen Netflix Account
                                            </td>
                                            <td
                                                style={{
                                                    padding: "15px",
                                                    textAlign: "right",
                                                    color: "#2ecc71",
                                                }}
                                            >
                                                $2.00
                                            </td>
                                        </tr>
                                        <tr style={{ borderBottom: "1px solid #333" }}>
                                            <td style={{ padding: "15px" }}>Credit Card Info</td>
                                            <td
                                                style={{
                                                    padding: "15px",
                                                    textAlign: "right",
                                                    color: "#2ecc71",
                                                }}
                                            >
                                                $20.00
                                            </td>
                                        </tr>
                                        <tr style={{ borderBottom: "1px solid #333" }}>
                                            <td style={{ padding: "15px" }}>Hacked Gmail Account</td>
                                            <td
                                                style={{
                                                    padding: "15px",
                                                    textAlign: "right",
                                                    color: "#2ecc71",
                                                }}
                                            >
                                                $80.00
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ),
                },
                // LESSON 4: BRIEFING (OSINT)
                {
                    id: "mod1_osint",
                    title: "Mission: OSINT Detective",
                    content: (
                        <div className="cr-lesson-container center-aligned">
                            <div className="cr-mission-display">
                                <div className="mission-icon-static"><FaUserSecret /></div>
                                <h2>MISSION: OSINT DETECTIVE</h2>
                                <h4 className="mission-subtitle">LIVE TARGET ACQUISITION</h4>
                            </div>

                            <div className="cr-mission-brief-grid">
                                <div className="brief-col">
                                    <h5><FaList /> Intel Report</h5>
                                    <p>
                                        We have identified the target's public social media profile.
                                        <br />
                                        <strong>Target Name:</strong> Sarah Jenkins
                                        <br />
                                        <strong>Handle:</strong> @sarah_j_23
                                    </p>
                                </div>
                                <div className="brief-col">
                                    <h5><FaRocket /> Objectives</h5>
                                    <ol>
                                        <li><strong>TEAR APART</strong> her public posts for personal info.</li>
                                        <li><strong>IDENTIFY</strong> pet names, locations, and dates.</li>
                                        <li><strong>GENERATE</strong> a password list from this data.</li>
                                        <li><strong>CRACK</strong> the account.</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="cr-final-warning" style={{ textAlign: "center" }}>
                                <p style={{ marginBottom: "20px" }}>
                                    <strong>Rules of Engagement:</strong>
                                    <br />
                                    You are looking for specific keywords (Pet Name, City, Apartment).
                                    <br />
                                    Click on the text in the posts to collect intel.
                                </p>
                                <p style={{ color: "#00d4ff", fontStyle: "italic", marginTop: "20px" }}>
                                    CLICK "START SIMULATION" BELOW TO BEGIN
                                </p>
                            </div>
                        </div>
                    ),
                },

            ],
        },
        // =========================================================================
        // PHASE 2: THE HOW - BUILDING THE FORTRESS
        // =========================================================================
        {
            phaseId: "pm_p2_fortress",
            phaseNumber: 2,
            title: "Module 2: Building Your Defense",
            type: "learning",
            duration: "20 min",
            difficulty: "Beginner",
            xpReward: 650,
            description:
                'Learn the "Holy Grail" of security tools and how to create a password you can actually remember.',
            topics: ["Passphrases", "Password Managers", "2-Step Verification"],
            icon: <FaShieldAlt />,
            professor: {
                name: "The Guardian",
                title: "Defense Expert",
                avatarIcon: <FaShieldAlt />,
            },
            lessons: [
                // LESSON 1: DEATH OF COMPLEX PASSWORD
                {
                    id: "mod2_passphrase",
                    title: "Length beats Complexity",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaLock className="section-icon" style={{ color: "#2ecc71" }} />
                                <h2>SIZE MATTERS</h2>
                            </div>

                            <div className="cr-content-block">
                                <p>
                                    Stop trying to be clever with <code>Password123</code>. Short
                                    passwords are easy to crack.
                                </p>
                                <p>
                                    The secret? <strong>Use a long sentence.</strong>
                                </p>

                                <div className="cr-grid-2">
                                    <div
                                        style={{
                                            background: "#111",
                                            padding: "20px",
                                            borderRadius: "12px",
                                            borderTop: "4px solid #ff4757",
                                        }}
                                    >
                                        <h4 style={{ color: "#ff4757", marginTop: 0 }}>
                                            The Weak Way
                                        </h4>
                                        <div
                                            style={{
                                                fontSize: "1.5rem",
                                                fontFamily: "monospace",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            password123
                                        </div>
                                        <div style={{ color: "#888", fontSize: "0.9rem" }}>
                                            Too short.
                                            <br />
                                            Commonly used.
                                            <br />
                                            <strong>Crack Time: Instantly</strong>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            background: "#111",
                                            padding: "20px",
                                            borderRadius: "12px",
                                            borderTop: "4px solid #2ecc71",
                                        }}
                                    >
                                        <h4 style={{ color: "#2ecc71", marginTop: 0 }}>
                                            The Strong Way
                                        </h4>
                                        <div
                                            style={{
                                                fontSize: "1.5rem",
                                                fontFamily: "monospace",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            Purple-Galaxy-42!
                                        </div>
                                        <div style={{ color: "#888", fontSize: "0.9rem" }}>
                                            Easy to remember.
                                            <br />
                                            Meets all requirements.
                                            <br />
                                            <strong>Crack Time: 5,000 Years</strong>
                                        </div>
                                    </div>
                                </div>

                                <FactBox title="The Passphrase Trick" type="success">
                                    Pick 3-4 random words. Add a number and symbol.
                                    <br />
                                    Example: <code>Coffee-N1nja-Pizza!</code>.
                                </FactBox>
                            </div>
                        </div>
                    ),
                },
                // LESSON 2: PASSWORD MANAGERS
                {
                    id: "mod2_managers",
                    title: "The Holy Grail",
                    content: (
                        <div className="cr-lesson-container">
                            <div
                                className="cr-lesson-hero"
                                style={{
                                    background: "linear-gradient(135deg, #10b981, #065f46)",
                                }}
                            >
                                <div className="cr-hero-icon">
                                    <FaDatabase />
                                </div>
                                <h2>THE VAULT</h2>
                                <p>You should only know ONE password.</p>
                            </div>

                            <div className="cr-content-block">
                                <p>
                                    There is no way you can remember 50 different passwords. You
                                    need a <strong>Password Manager</strong>.
                                </p>
                                <p>
                                    Think of it like a digital safe. You put all your passwords
                                    inside, and you just digest <strong>one key</strong> to open
                                    the safe.
                                </p>

                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {[
                                        {
                                            title: "It Remembers For You",
                                            desc: "You never have to click 'Forgot Password' again.",
                                        },
                                        {
                                            title: "It Types For You",
                                            desc: "It fills in your username and password automatically.",
                                        },
                                        {
                                            title: "It Generates Chaos",
                                            desc: "It creates super strong passwords like 's8*@#kL9v!' that you don't even need to see.",
                                        },
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                marginBottom: "15px",
                                                background: "#1f2937",
                                                padding: "15px",
                                                borderRadius: "8px",
                                                borderLeft: "4px solid #34d399",
                                            }}
                                        >
                                            <strong style={{ color: "#34d399", display: "block" }}>
                                                {item.title}
                                            </strong>
                                            {item.desc}
                                        </li>
                                    ))}
                                </ul>

                                <FactBox title="Recommendation" type="insane">
                                    Use tools like Bitwarden, 1Password, or Google Password
                                    Manager.
                                </FactBox>
                            </div>
                        </div>
                    ),
                },
                // LESSON 3: MFA TIER LIST
                {
                    id: "mod2_mfa",
                    title: "Two-Factor Authentication (2FA)",
                    content: (
                        <div className="cr-lesson-container">
                            <h2
                                style={{
                                    textAlign: "center",
                                    marginBottom: "30px",
                                    color: "#fff",
                                    textTransform: "uppercase",
                                    letterSpacing: "3px",
                                }}
                            >
                                The Double-Check
                            </h2>

                            <div className="cr-content-block">
                                <p>
                                    2FA is like adding a deadbolt to your door. Even if they have
                                    your key (password), they still can't get in without the
                                    second check.
                                </p>

                                <div
                                    style={{ display: "grid", gap: "20px", marginTop: "20px" }}
                                >
                                    {/* S TIER */}
                                    <div
                                        style={{
                                            background: `linear-gradient(90deg, #2ecc71 0%, #1e1e1e 40%)`,
                                            padding: "2px",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                background: "#111",
                                                padding: "20px",
                                                borderRadius: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "20px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "3rem",
                                                    color: "#2ecc71",
                                                    fontWeight: "900",
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                1
                                            </div>
                                            <div>
                                                <h4
                                                    style={{
                                                        color: "#2ecc71",
                                                        margin: 0,
                                                        fontSize: "1.2rem",
                                                    }}
                                                >
                                                    Authenticator Apps (Best)
                                                </h4>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        color: "#999",
                                                        fontSize: "0.9rem",
                                                    }}
                                                >
                                                    An app on your phone (like Google Authenticator)
                                                    generates a code that changes every 30 seconds.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* C TIER */}
                                    <div
                                        style={{
                                            background: `linear-gradient(90deg, #eab308 0%, #1e1e1e 40%)`,
                                            padding: "2px",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                background: "#111",
                                                padding: "20px",
                                                borderRadius: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "20px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "3rem",
                                                    color: "#eab308",
                                                    fontWeight: "900",
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                2
                                            </div>
                                            <div>
                                                <h4
                                                    style={{
                                                        color: "#eab308",
                                                        margin: 0,
                                                        fontSize: "1.2rem",
                                                    }}
                                                >
                                                    SMS Text Code (Okay)
                                                </h4>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        color: "#999",
                                                        fontSize: "0.9rem",
                                                    }}
                                                >
                                                    Better than nothing, but scammers can sometimes steal
                                                    your phone number.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                // LESSON 4: HAVE I BEEN PWNED
                {
                    id: "mod2_pwned",
                    title: "Checking the Damage",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaSearch
                                    className="section-icon"
                                    style={{ color: "#f472b6" }}
                                />
                                <h2>ARE YOU ALREADY LEAKED?</h2>
                            </div>

                            <div className="cr-content-block">
                                <p>You might already be hacked and not know it.</p>

                                <ConceptCard
                                    icon={<FaBiohazard />}
                                    title="HaveIBeenPwned.com"
                                    description="This is a safe, free website. Type in your email. It will tell you if your password has been stolen in a breach."
                                    color="#f472b6"
                                />

                                <FactBox title="What to do" type="danger">
                                    If it says you are 'Pwned', don't panic. Just go change your
                                    password for that account immediately.
                                </FactBox>
                            </div>
                        </div>
                    ),
                },
                // LESSON 4: MISSION BRIEFING
                {
                    id: "mod2_mission_brief",
                    title: "Mission: Fortress Builder",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaShieldAlt className="section-icon" style={{ color: "#2ecc71" }} />
                                <h2>MISSION BRIEFING</h2>
                            </div>

                            <div className="cr-mission-brief-grid">
                                <div className="brief-col">
                                    <h5><FaLock /> Situation</h5>
                                    <p>
                                        We have intercepted a vulnerable account belonging to a high-value target (YOU).
                                        It is currently protected by "password123".
                                    </p>
                                </div>
                                <div className="brief-col">
                                    <h5><FaCheckCircle /> Objectives</h5>
                                    <ol>
                                        <li><strong>SECURE</strong> the password with a passphrase.</li>
                                        <li><strong>ENABLE</strong> Two-Factor Authentication.</li>
                                        <li><strong>VERIFY</strong> security status.</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="cr-final-warning" style={{ textAlign: "center" }}>
                                <p style={{ color: "#2ecc71", fontStyle: "italic", marginTop: "40px" }}>
                                    CLICK "START SIMULATION" BELOW TO SECURE THE ASSET
                                </p>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        // =========================================================================
        // PHASE 3: THE FUTURE - STAYING AHEAD
        // =========================================================================
        {
            phaseId: "pm_p3_future",
            phaseNumber: 3,
            title: "Module 3: Advanced Tips made Easy",
            type: "learning",
            duration: "15 min",
            difficulty: "Beginner",
            xpReward: 800,
            description:
                "Simple ways to protect yourself from modern AI scams and backup plans.",
            topics: ["No more Passwords", "AI Scams", "Backup Plan"],
            icon: <FaRocket />,
            professor: {
                name: "The Futurist",
                title: "Tech Lead",
                avatarIcon: <FaBrain />,
            },
            lessons: [
                // LESSON 1: PASSKEYS
                {
                    id: "mod3_passkeys",
                    title: "Passkeys: No More Typing",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-lesson-hero" style={{ background: "#4f46e5" }}>
                                <div className="cr-hero-icon">
                                    <FaFingerprint />
                                </div>
                                <h2>THE FUTURE</h2>
                                <p>Imagine logging in just by looking at your phone.</p>
                            </div>

                            <div className="cr-content-block">
                                <p>
                                    <strong>Passkeys</strong> are a new feature from Google and
                                    Apple.
                                </p>
                                <ul style={{ marginTop: "20px" }}>
                                    <li style={{ marginBottom: "10px" }}>
                                        <strong>Zero Typing:</strong> You verify with FaceID or
                                        Fingerprint.
                                    </li>
                                    <li style={{ marginBottom: "10px" }}>
                                        <strong>Un-Stealable:</strong> There is no password for a
                                        hacker to steal.
                                    </li>
                                    <li>
                                        <strong>Easy:</strong> It just works. If you see an option
                                        to "Create Passkey", do it.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ),
                },
                // LESSON 2: AI PHISHING
                {
                    id: "mod3_ai",
                    title: "The AI Scams",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaRobot
                                    className="section-icon"
                                    style={{ color: "#00d4ff" }}
                                />
                                <h2>SCAMMERS USE AI NOW</h2>
                            </div>
                            <div className="cr-content-block">
                                <p>
                                    Scammers are using tools like ChatGPT to write near-perfect
                                    emails.
                                </p>
                                <FactBox title="Bad Grammar is Gone" type="warning">
                                    Old scam emails had bad spelling. New ones are perfect. They
                                    can even sound like your boss. Always double-check the
                                    sender's email address.
                                </FactBox>
                            </div>
                        </div>
                    ),
                },
                // LESSON 3: EMERGENCY & AUDIT
                {
                    id: "mod3_audit",
                    title: "The Backup Plan",
                    content: (
                        <div className="cr-lesson-container">
                            <div className="cr-section-header">
                                <FaClipboardCheck
                                    className="section-icon"
                                    style={{ color: "#2ecc71" }}
                                />
                                <h2>STAYING SAFE</h2>
                            </div>

                            <div className="cr-content-block">
                                <h3 style={{ borderBottom: "1px solid #333" }}>
                                    What if you forget?
                                </h3>
                                <p>
                                    If you use a Password Manager, make sure you set up an{" "}
                                    <strong>Emergency Kit</strong> (a piece of paper with your
                                    master password) and lock it in a real safe or drawer.
                                </p>

                                <h3
                                    style={{ borderBottom: "1px solid #333", marginTop: "30px" }}
                                >
                                    The 5-Minute Check
                                </h3>
                                <div
                                    style={{
                                        background: "#111",
                                        padding: "20px",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <FaCheckDouble style={{ color: "#2ecc71" }} /> Check your
                                        email for weird login alerts
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <FaCheckDouble style={{ color: "#2ecc71" }} /> Update your
                                        phone software
                                    </div>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <FaCheckDouble style={{ color: "#2ecc71" }} /> Change one
                                        password that you know is weak
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                },
                // LESSON 4: MISSION BRIEFING
                {
                    id: "mod3_mission_vault",
                    title: "Mission: Vault Builder",
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
                                        We have recovered a "Digital Vault" containing leaked credentials.
                                        It is in <strong>CRITICAL</strong> state.
                                    </p>
                                </div>
                                <div className="brief-col">
                                    <h5><FaCheckCircle /> Objectives</h5>
                                    <ol>
                                        <li><strong>AUDIT</strong> the vault for weak passwords.</li>
                                        <li><strong>UPGRADE</strong> accounts to Passkeys.</li>
                                        <li><strong>GENERATE</strong> entropy for old accounts.</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="cr-final-warning" style={{ textAlign: "center" }}>
                                <p style={{ color: "#4f46e5", fontStyle: "italic", marginTop: "40px" }}>
                                    CLICK "START SIMULATION" BELOW TO ENTER THE VAULT
                                </p>
                            </div>
                        </div>
                    ),
                },
            ]
        },
        // =========================================================================
        // PHASE 4: FINAL EXAM
        // =========================================================================
        {
            phaseId: 'pm_p4_exam',
            phaseNumber: 4,
            ...syncScenario('sc_password_exam', {
                title: 'EXAM: THE GAUNTLET',
                xpReward: 1000,
                duration: '15 min',
                difficulty: 'Intermediate'
            }),
            type: 'scenario',
            scenarioId: 'sc_password_exam',
            description: 'FINAL EXAM. Test your knowledge. Can you spot the risks and secure the account?',
            topics: ['Review', 'Safety Check', 'Quiz'],
            icon: <FaMedal />
        }
    ]
};

export default PasswordMastery;
