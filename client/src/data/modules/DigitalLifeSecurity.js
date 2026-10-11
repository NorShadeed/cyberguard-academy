import React from 'react';
import {
    FaMobileAlt, FaShieldAlt, FaGlobe, FaWifi, FaUserSecret,
    FaLock, FaMapMarkerAlt, FaEye, FaFingerprint, FaKey,
    FaPlane, FaBatteryHalf, FaUsb, FaCamera, FaMicrophone, FaBluetooth,
    FaUserShield, FaCloud, FaTrash, FaShareAlt, FaCreditCard, FaLaptop,
    FaHome, FaNetworkWired, FaGhost // Added for new lessons
} from 'react-icons/fa';
import { ConceptCard, FactBox, HeroSection } from '../../features/training/components/TrainingUI';
import '../../features/training/styles/DigitalLifeSecurity.css'; // Keep for custom usage

// Helper Components
const StatCard = ({ number, text }) => (
    <div style={{
        textAlign: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(20,20,30,0.95), rgba(5,5,10,0.98))',
        borderRadius: '16px',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{number}</div>
        <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>{text}</div>
    </div>
);



/**
 * DIGITAL LIFE SECURITY MODULE
 * Consolidates Mobile, Remote Work, and Privacy into one cohesive narrative.
 * EXPANDED VERSION: Targeting comprehensive depth and "easy" teaching style.
 */
const DigitalLifeSecurity = {
    id: 'digital-life-security',
    title: 'Digital Life Security',
    category: 'Personal Defense',
    icon: <FaMobileAlt />,
    color: '#10b981', // Emerald Green (Growth/Safety)
    image: '/images/course-mobile-pixel.png',
    description: 'The ultimate guide to securing your personal digital life. From the phone in your pocket to the data in the cloud.',
    businessValue: 'A secure employee is secure everywhere. Mitigates risk from BYOD (Bring Your Own Device) and remote work vectors.',
    targetAudience: 'Everyone. Literally everyone with a phone.',
    certificateName: 'Digital Life Badge',

    outcomes: [
        'Lock down iOS/Android devices against spyware',
        'Travel securely without leaking data at airports or hotels',
        'Erase your personal info from Data Broker sites',
        'Understand "The Cloud" and where your photos actually go'
    ],

    roi: {
        riskReduction: 'Critical',
        avgIncidentCost: 'Priceless (Identity Theft Prevention)',
        timeToValue: 'Immediate',
        complianceStandards: ['BYOD Policy', 'GDPR', 'CCPA']
    },

    phases: [
        // =========================================================================
        // MODULE 1: THE POCKET FORTRESS (Mobile Defense)
        // =========================================================================
        {
            phaseId: 'life_p1_mobile',
            phaseNumber: 1,
            title: 'Module 1: The Pocket Fortress',
            type: 'learning',
            duration: '45 min',
            difficulty: 'Beginner',
            xpReward: 800,
            description: 'Your smartphone is the most dangerous device you own. Let\'s turn it into a fortress.',
            topics: ['Smishing', 'App Permissions', 'OS Updates', 'Find My Device', '2FA Apps'],
            icon: <FaMobileAlt />,
            professor: {
                name: "Agent K",
                title: "Mobile Security Specialist",
                avatarIcon: <FaUserSecret />
            },
            lessons: [

                {
                    id: 'mod1_intro',
                    title: "The Spy in Your Pocket",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE BLACK MIRROR"
                                subtitle="It knows where you sleep, who you talk to, and what you buy."
                                icon={<FaMobileAlt />}
                                color="#059669"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Think about it. Your phone has a camera, a microphone, a GPS tracker, and an internet connection.
                                    If a hacker gets in, they don't just steal your files—they <strong>become you</strong>.
                                </p>

                                <div className="cr-grid-2" style={{ marginTop: '30px' }}>
                                    <StatCard number="2.5h" text="Avg time spent on phone daily" />
                                    <StatCard number="93%" text="People who sleep with their phone" />
                                </div>

                                <h3 style={{ marginTop: '30px', color: '#10b981' }}>The Attack Surface</h3>
                                <p>
                                    Attackers love phones because we trust them. We install apps without thinking. We click links while walking.
                                    We treat them like toys, but they are军-grade surveillance devices.
                                </p>

                                <FactBox title="The Goal" type="success">
                                    We are not going to throw away our phones. We are going to <strong>Lock Them Down</strong>.
                                    By the end of this module, you will have a "Pocket Fortress".
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod1_smishing',
                    title: "Smishing: The New Spam",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="SMS PHISHING (SMISHING)"
                                icon={<FaMobileAlt />}
                                color="#f59e0b"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Email filters are getting good. Really good. So scammers have moved to the one place where you have ZERO spam filters: <strong>Text Messages</strong>.
                                </p>

                                <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333', margin: '20px 0' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>🛑 The "Anxiety" Trigger</h4>
                                    <p style={{ fontFamily: 'monospace', color: '#f59e0b' }}>
                                        "USPS: We missed your delivery. Please update your address or the package will be returned: usps-track-help.com"
                                    </p>
                                    <p style={{ fontSize: '0.9rem', color: '#888' }}>
                                        <strong>Why it works:</strong> You ordered something from Amazon recently. Everyone has. So you think, "Oh no, my package!" and you click.
                                    </p>
                                </div>

                                <h3>The "Rule of Thumb" (Literally)</h3>
                                <p>
                                    Before you tap that link with your thumb, stop. Look at the URL.
                                </p>
                                <ul className="cr-list">
                                    <li><strong>Real:</strong> usps.com</li>
                                    <li><strong>Fake:</strong> usps-tracking-info.net</li>
                                    <li><strong>Fake:</strong> usps.com.tracking-update.xyz</li>
                                </ul>

                                <FactBox title="The 3-Second Rule" type="warning">
                                    When you get a text that makes you feel <strong>URGENCY</strong> (Fear, Excitement, Curiosity), count to 3.
                                    Scammers rely on you acting fast. Slow down.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod1_permissions',
                    title: "App Permissions: The Silent Theft",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="WHO IS WATCHING?"
                                icon={<FaEye />}
                                color="#ef4444"
                            />
                            <div className="cr-content-block">
                                <p>
                                    When you install a "Flashlight" app, why does it ask for your <strong>Contacts</strong>?
                                    <br />
                                    <strong>Answer:</strong> To sell them.
                                </p>

                                <p>Apps are free because YOU are the product. They harvest your data and sell it to advertisers.</p>

                                <h3 style={{ color: '#ef4444' }}>The Big Three to Watch</h3>
                                <div className="cr-grid-3">
                                    <div className="cr-card">
                                        <FaMapMarkerAlt size={30} color="#ef4444" />
                                        <h4>Location</h4>
                                        <p style={{ fontSize: '0.85rem' }}>Does this app need to know where I am right now?</p>
                                        <strong style={{ color: '#10b981' }}>Maps: Yes</strong>
                                        <br />
                                        <strong style={{ color: '#ef4444' }}>Calculator: No</strong>
                                    </div>
                                    <div className="cr-card">
                                        <FaMicrophone size={30} color="#ef4444" />
                                        <h4>Microphone</h4>
                                        <p style={{ fontSize: '0.85rem' }}>Is it listening for voice commands or ad keywords?</p>
                                        <strong style={{ color: '#10b981' }}>Recorder: Yes</strong>
                                        <br />
                                        <strong style={{ color: '#ef4444' }}>Flashlight: No</strong>
                                    </div>
                                    <div className="cr-card">
                                        <FaCamera size={30} color="#ef4444" />
                                        <h4>Camera</h4>
                                        <p style={{ fontSize: '0.85rem' }}>Can it take photos in the background?</p>
                                        <strong style={{ color: '#10b981' }}>Instagram: Yes</strong>
                                        <br />
                                        <strong style={{ color: '#ef4444' }}>Weather: No</strong>
                                    </div>
                                </div>

                                <FactBox title="Action Item: The Audit" type="info">
                                    Go to <strong>Settings {'>'} Privacy {'>'} App Permissions</strong> right now.
                                    Look at "Location". Change everything to "While Using" or "Never".
                                    Nothing should be "Always".
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod1_updates',
                    title: "Updates: The 'Remind Me Later' Trap",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="UPDATE OR DIE"
                                subtitle="Why 'Remind me tomorrow' is a death sentence for your data."
                                icon={<FaCloud />}
                                color="#3b82f6"
                            />
                            <div className="cr-content-block">
                                <p>
                                    We all hate system updates. They take 20 minutes. They change the menus. They are annoying.
                                    <br />
                                    But you need to understand <strong>what an update actually is</strong>.
                                </p>

                                <h3 style={{ color: '#3b82f6' }}>The Race Against Time</h3>
                                <p>
                                    When Apple or Google releases an update, they usually include "Security Patches".
                                    This means hackers found a hole in the wall, and the company is trying to patch it with cement.
                                </p>

                                <div style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '15px' }}>
                                    <p><strong>Day 0:</strong> Hacker finds bug.</p>
                                    <p><strong>Day 10:</strong> Apple releases update to fix bug.</p>
                                    <p><strong>Day 11:</strong> Hackers read the update notes, figure out exactly where the hole was, and attack EVERYONE who hasn't updated yet.</p>
                                </div>

                                <FactBox title="Auto-Updates" type="success">
                                    Turn on <strong>Automatic Updates</strong>. Your phone will update while you sleep.
                                    It is the single most effective thing you can do to stop hackers.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod1_mission',
                    title: "MISSION BRIEFING: Pocket Fortress",
                    type: 'simulation', // Triggers the interactive component
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="OPERATION: POCKET FORTRESS"
                                subtitle="Secure the device. Protect the asset."
                                icon={<FaMobileAlt />}
                                color="#10b981"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Agent, we have intercepted a high-value target's device. It is currently compromised.
                                    <br />
                                    Your objective is to secure it before the adversary exfiltrates the data.
                                </p>
                                <ul style={{ background: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
                                    <li style={{ marginBottom: '10px' }}><strong>1. Clean Infection:</strong> Run the antivirus to remove active spyware.</li>
                                    <li style={{ marginBottom: '10px' }}><strong>2. Hardening:</strong> Revoke dangerous permissions (Camera, Mic, Location) from untrusted apps.</li>
                                    <li><strong>3. Authentication:</strong> Enable 2-Factor Authentication on the primary account.</li>
                                </ul>
                                <p>
                                    Good luck.
                                </p>
                            </div>
                        </div>
                    )
                }
            ]
        },

        // =========================================================================
        // MODULE 2: THE DIGITAL NOMAD (Remote & Travel)
        // =========================================================================
        {
            phaseId: 'life_p2_nomad',
            phaseNumber: 2,
            title: 'Module 2: The Digital Nomad',
            type: 'learning',
            duration: '50 min',
            difficulty: 'Intermediate',
            xpReward: 900,
            description: 'Coffee shops, airports, and hotels. How to survive in the wild.',
            topics: ['Public Wi-Fi', 'VPNs', 'Juice Jacking', 'Shoulder Surfing', 'Evil Maid'],
            icon: <FaWifi />,
            professor: {
                name: "Agent K",
                title: "Field Operative",
                avatarIcon: <FaGlobe />
            },
            lessons: [

                {
                    id: 'mod2_wifi_vpn',
                    title: "Public Wi-Fi & The Magic Tunnel",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE COFFEE SHOP HACK"
                                subtitle="Free Wi-Fi is the most expensive thing you'll ever use."
                                icon={<FaWifi />}
                                color="#ef4444"
                            />
                            <div className="cr-content-block">
                                <p>
                                    It's simple. Wi-Fi works like a radio station. If you can hear the music, so can everyone else.
                                    On an open network (no password), your data is flying through the air naked.
                                </p>

                                <h3>The "Man in the Middle"</h3>
                                <p>
                                    A hacker sits in the corner of the cafe with a $30 antenna. They intercept your signal.
                                    They see the emails you send. They steal the session cookies for your Facebook login.
                                </p>

                                <div style={{ background: 'linear-gradient(135deg, rgba(20,20,30,0.95), rgba(5,5,10,0.98))', padding: '20px', borderRadius: '12px', marginTop: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <h4 style={{ color: '#10b981', margin: 0 }}><FaShieldAlt /> The Solution: VPN</h4>
                                    <p>
                                        <strong>Virtual Private Network (VPN)</strong> creates a "Magic Tunnel" through the dangerous Wi-Fi.
                                        <br />
                                        Ideally, imagine dragging a steel pipe through the room. You shout your secrets into the pipe.
                                        The hacker can see the pipe, but they can't hear what's inside.
                                    </p>
                                </div>

                                <FactBox title="Which VPN?" type="info">
                                    Avoid "Free VPNs" (they sell your data). Use trusted, paid services like ProtonVPN, NordVPN, or Mullvad.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod2_evil_twin',
                    title: "The Evil Twin: Impersonation",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE EVIL TWIN"
                                subtitle="When 'Starbucks_WiFi' isn't actually Starbucks."
                                icon={<FaGhost />}
                                color="#d946ef"
                            />
                            <div className="cr-content-block">
                                <p>
                                    You see a Wi-Fi network called "Airport_Free_WiFi". You connect. It works.
                                    <br />
                                    <strong>Real World:</strong> The hacker is sitting next to you with a Pineapple (hacking device) broadcasting that name. You just connected directly to their device.
                                </p>
                                <FactBox title="The 5G Rule" type="success">
                                    When doing banking or sensitive work in public, <strong>Turn Off Wi-Fi</strong>.
                                    Use your cellular data (Hotspot). It is significantly harder to intercept 5G signals than Wi-Fi.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod2_juice',
                    title: "Juice Jacking: The Dirty Port",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="NEVER TRUST A FREE CHARGER"
                                icon={<FaUsb />}
                                color="#f59e0b"
                            />
                            <div className="cr-content-block">
                                <p>
                                    You are at the airport. 4% battery. You see a USB charging station. You plug in.
                                    <br />
                                    <strong>Mistake.</strong>
                                </p>

                                <h3>The USB Cable Trap</h3>
                                <p>
                                    A USB cable has pins for POWER and pins for DATA.
                                    When you plug into a public kiosk, the kiosk can ask your phone: "Hey, can I see your photos?"
                                    Some older phones say "Yes" automatically.
                                </p>

                                <FactBox title="The USB Condom" type="success">
                                    Yes, that's a real term. It's a tiny dongle ($5) that blocks the DATA pins and only lets POWER through.
                                    <br />
                                    <strong>Better yet:</strong> Plug your cable into your own power block (the brick), and plug the brick into the wall outlet (AC).
                                    Power outlets are dumb. USB ports are smart (and dangerous).
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod2_home_fortress',
                    title: "Home Fortress: IoT Security",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE SMART HOME TRAP"
                                subtitle="Your fridge is smarter than you think. And less secure."
                                icon={<FaHome />}
                                color="#10b981"
                            />
                            <div className="cr-content-block">
                                <p>
                                    You secured your laptop. But you forgot your Ring doorbell, your Hue lights, and your Smart Fridge.
                                    These are all tiny computers running Linux, often with default passwords like <code>admin/admin</code>.
                                </p>
                                <FactBox title="Network Segmentation" type="insane">
                                    <strong>Pro Move:</strong> Create a "Guest Network" on your router.
                                    Connect all your smart devices (IoT) to the Guest Network.
                                    Connect your Laptop/Phone to the Main Network.
                                    <br />
                                    <strong>Why?</strong> If a hacker compromises your lightbulb, they are trapped in the Guest Network. They cannot jump over to steal your banking data from your laptop.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod2_physical',
                    title: "Visual Hacking & The Evil Maid",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="EYES EVERYWHERE"
                                icon={<FaUserSecret />}
                                color="#8b5cf6"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Hacking isn't always code. Sometimes it's just looking.
                                </p>

                                <h3>Shoulder Surfing</h3>
                                <p>
                                    You are on a plane/train working on a confidential spreadsheet. The guy next to you is bored. He reads your screen.
                                    Simple. Effective. devastating.
                                </p>
                                <FactBox title="Defense: Privacy Filter" type="info">
                                    A polarized screen protector makes your screen look black from the side. Only you can see it straight on.
                                </FactBox>

                                <hr style={{ borderColor: '#333', margin: '30px 0' }} />

                                <h3>The "Evil Maid" Attack</h3>
                                <p>
                                    You leave your laptop in your hotel room to go to dinner. Does the cleaning staff have a key? Yes.
                                    Could an attacker bribe them to let them in for 2 minutes? Yes.
                                    <br />
                                    2 minutes is enough to plug in a "Rubber Ducky" USB and infect your laptop.
                                </p>

                                <FactBox title="Hotel Protocol" type="danger">
                                    1. Put the "Do Not Disturb" sign on.
                                    <br />
                                    2. Lock your laptop in the room safe (it's not perfect but it slows them down).
                                    <br />
                                    3. <strong>Take it with you.</strong>
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod2_mission',
                    title: "MISSION BRIEFING: Digital Nomad",
                    type: 'simulation',
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="OPERATION: DIGITAL NOMAD"
                                subtitle="Transit Security Protocol Initiated."
                                icon={<FaPlane />}
                                color="#3b82f6"
                            />
                            <div className="cr-content-block">
                                <p>
                                    You are in transit with sensitive Intel. Hostiles are monitoring local networks.
                                    <br />
                                    You must navigate the airport environment and transmit the package securely.
                                </p>
                                <FactBox title="Mission Parameters" type="warning">
                                    Avoid all "Free" Wi-Fi networks.<br />
                                    Do not trust public USB ports.<br />
                                    Maintain physical situational awareness.
                                </FactBox>
                            </div>
                        </div>
                    )
                }
            ]
        },

        // =========================================================================
        // MODULE 3: THE INVISIBLE YOU (Privacy)
        // =========================================================================
        {
            phaseId: 'life_p3_privacy',
            phaseNumber: 3,
            title: 'Module 3: The Invisible You',
            type: 'learning',
            duration: '60 min',
            difficulty: 'Intermediate',
            xpReward: 1000,
            description: 'You are leaking data like a broken pipe. Time to seal the leaks.',
            topics: ['Social Media', 'Data Brokers', 'Browser Fingerprinting', 'Metadata'],
            icon: <FaFingerprint />,
            professor: {
                name: "Agent K",
                title: "Privacy Advocate",
                avatarIcon: <FaKey />
            },
            lessons: [

                {
                    id: 'mod3_social',
                    title: "Social Media: The Overshare",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE VOLUNTARY DOSSIER"
                                subtitle="You are building the file that hackers will use to destroy you."
                                icon={<FaShareAlt />}
                                color="#d946ef"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Hackers don't need to guess your password. They verify it.
                                    Security Questions are usually based on biographical facts.
                                </p>

                                <div className="cr-grid-2">
                                    <ConceptCard
                                        icon={<FaShareAlt />}
                                        title="The Post"
                                        description="'Throwback Thursday to my first car! Use to love this old Honda Civic ❤️'"
                                        color="#d946ef"
                                    />
                                    <ConceptCard
                                        icon={<FaUserSecret />}
                                        title="The Hack"
                                        description="Security Question: 'What was the make of your first car?' Answer: Honda Civic."
                                        color="#ef4444"
                                    />
                                </div>

                                <h3 style={{ marginTop: '30px' }}>The "Attacker's Map"</h3>
                                <p>
                                    <strong>Posting your Boarding Pass?</strong> Attackers can get your passport number from the barcode.
                                    <br />
                                    <strong>Posting your "Welcome to the Team" badge?</strong> Attackers can copy the RFID design and walk into your office.
                                </p>

                                <FactBox title="Lock It Down" type="info">
                                    Set your profiles to <strong>Private</strong>.
                                    Remove "Friends" you don't actually know.
                                    Never post photos of keys, badges, or documents.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod3_data_brokers',
                    title: "Data Brokers: The Traffickers",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="YOUR LIFE FOR SALE: $0.05"
                                icon={<FaCreditCard />}
                                color="#10b981"
                            />
                            <div className="cr-content-block">
                                <p>
                                    There are companies (Equifax, Acxiom, Oracle) that buy data from apps, credit cards, and stores.
                                    They build a profile of you that is frighteningly accurate.
                                </p>
                                <ul>
                                    <li>Health issues (from pharmacy purchases)</li>
                                    <li>Political views (from articles read)</li>
                                    <li>Financial struggle (from loan applications)</li>
                                </ul>

                                <p>
                                    They sell this list to marketers, insurance companies, and sometimes... it gets stolen by hackers (e.g., the Equifax Breach).
                                </p>

                                <FactBox title="The Opt-Out" type="success">
                                    You have the right to disappear. Sites like "DeleteMe" or "Optery" automate the process of sending legal "Delete My Data" requests to these brokers.
                                    It is worth every penny.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod3_browser',
                    title: "Browser Fingerprinting",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="THE DIGITAL FINGERPRINT"
                                icon={<FaLaptop />}
                                color="#3b82f6"
                            />
                            <div className="cr-content-block">
                                <p>
                                    You check "Delete Cookies", so you're safe, right?
                                    <strong>Wrong.</strong>
                                </p>

                                <h3>What is a Fingerprint?</h3>
                                <p>
                                    Websites can ask your browser a thousand tiny questions:
                                </p>
                                <ul style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#9ca3af' }}>
                                    <li>"What fonts do you have installed?"</li>
                                    <li>"What is your exact screen resolution?"</li>
                                    <li>"What version of graphics driver are you running?"</li>
                                </ul>
                                <p>
                                    The combination of these answers is unique to YOU. Even in "Incognito Mode", your fingerprint is the same. They know it's you coming back.
                                </p>

                                <FactBox title="Defense: Blend In" type="info">
                                    Use a browser that "generalizes" your fingerprint (like <strong>Brave</strong> or <strong>Firefox</strong> with Enhanced Tracking Protection).
                                    These browsers lie to websites to make you look like everyone else.
                                </FactBox>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod3_checklist',
                    title: "The Final Checklist",
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="YOU ARE READY"
                                subtitle="Go forth and be secure."
                                icon={<FaUserShield />}
                                color="#10b981"
                            />
                            <div className="cr-content-block">
                                <p>Security is not a product. It's a mindset. It's a habit.</p>

                                <FactBox title="The Digital Life Protocol" type="success">
                                    <ul style={{ lineHeight: '2' }}>
                                        <li>[ ] My phone has a 6-digit PIN and Biometrics (FaceID/Fingerprint).</li>
                                        <li>[ ] I use a Password Manager (Bitwarden, 1Password).</li>
                                        <li>[ ] I have 2FA enabled on Email, Banking, and Social Media.</li>
                                        <li>[ ] I never open SMS links. I navigate manually.</li>
                                        <li>[ ] My laptop is encrypted (BitLocker/FileVault).</li>
                                        <li>[ ] I use a VPN on public Wi-Fi.</li>
                                        <li>[ ] I cover my webcam when not in use.</li>
                                    </ul>
                                </FactBox>
                                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                                    You are now the <strong>Digital Life Protector</strong>.
                                </p>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'mod3_mission',
                    title: "MISSION BRIEFING: Invisible You",
                    type: 'simulation',
                    content: (
                        <div className="cr-lesson-container">
                            <HeroSection
                                title="OPERATION: GHOST PROTOCOL"
                                subtitle="Erase the footprint. Disappear."
                                icon={<FaUserSecret />}
                                color="#111"
                            />
                            <div className="cr-content-block">
                                <p>
                                    Your digital dossier is growing too large. It is being sold to the highest bidder.
                                    <br />
                                    Access the "Data Scrubber" terminal and sanitize your records.
                                </p>
                                <FactBox title="Objectives" type="info">
                                    1. <strong>Redact</strong> sensitive PII from social media.<br />
                                    2. <strong>Opt-Out</strong> from major Data Broker databases.<br />
                                    3. Achieve a Privacy Score of &gt;95%.
                                </FactBox>
                            </div>
                        </div>
                    )
                }
            ]
        }
    ]
};

export default DigitalLifeSecurity;
