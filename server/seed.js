const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scenario = require('./models/Scenario');
const TrainingModule = require('./models/TrainingModule');

dotenv.config();

// mongoose connection handled by caller (index.js) or standalone block below

const seedScenarios = [
    {
        id: 'sc_phishing_exam',
        title: 'Exam: Operation Inbox Zero',
        tagline: 'Trust No One. Verify Everything.',
        difficulty: 'Medium',
        xp: 1000,
        time: '15 Mins',
        thumbnail: '/images/operation_inbox_zero.png',
        description: 'LIVE FIRE EXERCISE: You have full control of the quarantine queue for TitanCorp\'s C-Suite. Sophisticated actors are targeting the CFO. One mistake grants them entry. Verify every header, check every log.',
        learningObjectives: [
            'Email Header Analysis (SPF/DKIM/DMARC)',
            'Identifying Malicious Payload Extensions',
            'Recognizing Social Engineering Indicators'
        ],
        totalSteps: 5,
        type: 'exam',
        roles: {
            "analyst": {
                id: 'analyst',
                title: 'Security Operator',
                description: 'The last line of defense.',
                startNode: 'start',
                nodes: {
                    'start': {
                        id: 'start',
                        text: "MISSION BRIEFING:\n\nHigh-value targets in the C-Suite are being targeted by sophisticated phishing campaigns. \n\nYOUR ORDERS:\nReview the quarantine queue. ONE mistake means a breach. Verify headers, check links, and trust no one.\n\nGOOD LUCK, OPERATOR.",
                        type: 'choice',
                        options: [
                            { text: "Initialize Queue >", next: 'email_1', points: 0 }
                        ]
                    },
                    'email_1': {
                        id: 'email_1',
                        text: "MSG 1/5 [FLAGGED HIGH PRIORITY]\n\nFROM: 'Microsoft 365 Security' <security@microsoft-auth-update.com>\nSUBJECT: ACTION REQUIRED: 2FA Device Added\n\n'A new device (iPhone 15, Beijing) was added to your MFA. If this wasn't you, click here to revoke.'",
                        type: 'choice',
                        data: [
                            {
                                type: 'log',
                                label: 'Link Analysis',
                                content: "TARGET: https://microsoft-auth-update.com/revoke?id=9283\nAGE: Domain registered 1 hour ago.\nSSL: Valid Let's Encrypt Certificate.\nREDIRECTS: None."
                            },
                            {
                                type: 'info',
                                label: 'Sender Info',
                                content: "DMARC: PASS (Aligned with 'microsoft-auth-update.com', NOT 'microsoft.com').\nIP: 104.21.x.x (Cloudflare)."
                            }
                        ],
                        options: [
                            { text: "Revoke Access (Click Link)", next: 'fail_1', points: 0, judge: "CRITICAL FAIL. 'microsoft-auth-update.com' is a look-alike domain. You just gave them your credentials." },
                            { text: "Blacklist Domain", next: 'email_2', points: 200, judge: "GOOD KILL. Domain age (1 hour) + Typosquatting = 100% Malicious. DMARC passed only because they own the fake domain." }
                        ]
                    },
                    'fail_1': {
                        id: 'fail_1',
                        text: "BREACH CONFIRMED.\n\nYou clicked a typosquatted link. The landing page looked identical to Microsoft's portal. Credential theft occurred.\n\nINCIDENT LOGGED. PROCEEDING TO NEXT TICKET...",
                        type: 'choice', // Changed to choice to allow continuation
                        options: [
                            { text: "Next Ticket >", next: 'email_2', points: 0 }
                        ]
                    },
                    'email_2': {
                        id: 'email_2',
                        text: "MSG 2/5\n\nFROM: 'Sarah Jenkins (CFO)' <sjenkins@titancorp.com>\nSUBJECT: Project Alpha - Wire Details\n\n'Sending this from my iPad. Need you to wire the vendor deposit ASAP. Attached is the invoice. Don't call, I'm in a board meeting.'\n\nATTACHMENT: Invoice_INV002.pdf",
                        type: 'choice',
                        data: [
                            {
                                type: 'log',
                                label: 'Email Headers',
                                content: "Received-From: mail-sender-04.marketing-blast.com\nX-Originating-IP: 45.79.x.x (Public VPN)\nReply-To: sjenkins.titancorp@gmail.com (MISMATCH)"
                            },
                            {
                                type: 'info',
                                label: 'Authentication',
                                content: "SPF: SOFTFAIL\nDKIM: FAIL"
                            }
                        ],
                        options: [
                            { text: "Process Payment", next: 'fail_2', points: 0, judge: "FAILURE. Classic CEO Fraud. 'Reply-To' mismatch and SPF fail are immediate red flags." },
                            { text: "Flag as Impersonation", next: 'email_3', points: 200, judge: "CORRECT. The 'Reply-To' address was external (gmail.com), hiding behind the display name. Good eye." }
                        ]
                    },
                    'fail_2': {
                        id: 'fail_2',
                        text: "WIRE FRAUD SUCCESSFUL.\n\nYou authorized a payment to a fraudulent account based on a spoofed email. The company just lost $50,000.\n\nINCIDENT LOGGED. PROCEEDING TO NEXT TICKET...",
                        type: 'choice',
                        options: [
                            { text: "Next Ticket >", next: 'email_3', points: 0 }
                        ]
                    },
                    'email_3': {
                        id: 'email_3',
                        text: "MSG 3/5\n\nFROM: 'HR-Benefits' <benefits@neo-benefits.com>\nSUBJECT: 2025 Health Plan Changes\n\n'Our provider has updated their terms. Review the attached plan changes immediately.'\n\nATTACHMENT: Plan_Changes_v2.docm",
                        type: 'choice',
                        data: [
                            {
                                type: 'log',
                                label: 'Attachment Scan',
                                content: "FILE: Plan_Changes_v2.docm\nTYPE: Microsoft Word Macro-Enabled Document\nMACROS: DETECTED (AutoExec, AutoOpen)\nSIGNATURE: Unsigned"
                            },
                            {
                                type: 'info',
                                label: 'Sender History',
                                content: "Neo-Benefits.com is a known partner.\nEmail volume matches historical baselines."
                            }
                        ],
                        options: [
                            { text: "Allow - Vendor is Trusted", next: 'fail_3', points: 0, judge: "CATASTROPHIC FAIL. The vendor was compromised. You allowed a double-extension executable (.pdf.exe) into the network." },
                            { text: "Block & Detonate in Sandbox", next: 'email_4', points: 200, judge: "EXCELLENT WORK. 'Double extension' attacks hide the .exe. High entropy suggested a packed payload. This was Zero-Day Ransomware." }
                        ]
                    },
                    'fail_3': {
                        id: 'fail_3',
                        text: "RANSOMWARE DEPLOYED.\n\nThe Word Macro downloaded a payload that encrypted the entire HR subnet.\n\nINCIDENT LOGGED. PROCEEDING TO NEXT TICKET...",
                        type: 'choice',
                        options: [
                            { text: "Next Ticket >", next: 'email_4', points: 0 }
                        ]
                    },
                    'email_4': {
                        id: 'email_4',
                        text: "MSG 4/5 [SYSTEM ALERT]\n\nFROM: no-reply@titancorp-monitoring.local\nSUBJECT: [ALERT] Apache Service Down on SRV-04\n\n'Service: httpd\nStatus: STOPPED\nAction: Restart Required'",
                        type: 'choice',
                        data: [
                            {
                                type: 'log',
                                label: 'Server Heartbeat Logs',
                                content: "TARGET: SRV-04\n14:00:01 - HEARTBEAT OK\n14:05:01 - HEARTBEAT FAILED\n14:05:05 - ALERT GENERATED"
                            }
                        ],
                        options: [
                            { text: "Ignore - It's Phishing", next: 'fail_4', points: 0, judge: "FAIL. You ignored a real infrastructure outage because you were paranoid. This caused 4 hours of downtime." },
                            { text: "Acknowledge Alert", next: 'email_5', points: 200, judge: "CORRECT. The sender domain '.local' and the correlated server logs confirm this is a legitimate system notification." }
                        ]
                    },
                    'fail_4': {
                        id: 'fail_4',
                        text: "DATABASE CRASH.\n\nYou marked a legitimate system alert as malicious. The production database ran out of space and crashed.\n\nINCIDENT LOGGED. PROCEEDING TO NEXT TICKET...",
                        type: 'choice',
                        options: [
                            { text: "Next Ticket >", next: 'email_5', points: 0 }
                        ]
                    },
                    'email_5': {
                        id: 'email_5',
                        text: "MSG 5/5\n\nFROM: 'Google Docs' <drive-shares-noreply@google.com>\nSUBJECT: 'Salary_Bands_2025.xlsx' shared with you\n\n'Someone@gmail.com has shared a document. TitanCorp uses G-Suite. Expected behavior?'",
                        type: 'choice',
                        data: [
                            {
                                type: 'log',
                                label: 'Link Inspection',
                                content: "URL: https://docs.google.com/spreadsheets/d/1823.../edit\nCERT: Google Trust Services\nREDIRECTS: None"
                            },
                            {
                                type: 'info',
                                label: 'Context',
                                content: "Sender 'someone@gmail.com' is external/unknown.\nNo prior business context found."
                            }
                        ],
                        options: [
                            { text: "Open Document", next: 'fail_5', points: 0, judge: "DATA EXFILTRATION. The doc hosted a fake login form (credential phishing) on a legitimate Google domain." },
                            { text: "Block External Share", next: 'success', points: 200, judge: "SECURE. Legitimate platform (Google Docs) + Unknown External Sender = High Risk. They were abusing Google's reputation." }
                        ]
                    },
                    'fail_5': {
                        id: 'fail_5',
                        text: "CREDENTIALS STOLEN.\n\nThe link was real (Google Docs), but the document itself contained a link to a fake login page. \n\nEXAM COMPLETE. SUBMITTING RESULTS...",
                        type: 'choice',
                        options: [
                            { text: "View Results >", next: 'success', points: 0 }
                        ]
                    },
                    'success': {
                        id: 'success',
                        text: "QUARANTINE QUEUE PROCESSED.\n\nYou have completed the assessment. The system has analyzed your performance across all 5 categories.",
                        type: 'ending',
                        outcome: 'calculated'
                    }
                }
            }
        }
    },
    {
        id: 'zero_day_004',
        title: 'Operation Zero Day Meltdown',
        tagline: 'A zero-day exploit is live. The network is bleeding. The attacker is already inside.',
        difficulty: 'Hard',
        xp: 1000,
        time: '45 Mins',
        thumbnail: '/images/hero-arbiter.png',
        description: "A zero-day exploit is live. The network is bleeding. The attacker is already inside.",
        learningObjectives: [
            "Experience a high-stakes, multi-stage zero-day attack.",
            "Understand the critical interplay between technical containment and crisis management."
        ],
        totalSteps: 4,
        roles: {
            "analyst": {
                startNode: 'start_analyst',
                nodes: {
                    'start_analyst': {
                        type: 'choice',
                        text: "Anomalous, encrypted traffic is bypassing all firewalls from a critical database server. This screams ZERO-DAY...",
                        options: [
                            { text: 'Hunt the worm. Deploy network segmentation to slow it.', points: 20, next: 'analyst_step2_worm', judge: "A solid tactical move..." },
                            { text: 'Ignore the worm and focus on the zero-day.', points: -10, next: 'ending_analyst_ivory_tower', judge: "You're an academic, not a defender..." }
                        ]
                    },
                    'analyst_step2_worm': {
                        type: 'choice',
                        text: "Segmentation is slowing the worm...",
                        options: [
                            { text: 'LOCK IT DOWN.', points: 10, next: 'ending_analyst_clean_sweep', judge: "The backups are safe..." }
                        ]
                    },
                    'ending_analyst_ivory_tower': { type: 'ending', success: false, text: "FAILURE. While you were admiring the architecture..." },
                    'ending_analyst_clean_sweep': { type: 'ending', success: true, text: "MISSION COMPLETE. You correctly identified that a compromised system can't be trusted..." }
                }
            }
        }
    },
    {
        id: 'exam_friendly_stranger',
        title: 'Exam: The Friendly Stranger',
        tagline: 'He brought donuts. He forgot his badge. He is definitely not a spy.',
        type: 'exam',
        difficulty: 'Easy',
        time: '10 Mins',
        xp: 1000,
        thumbnail: '/images/hero-social-engineer.png',
        description: 'A social engineer named "Chad" is trying to access the building. He won\'t just kick the door in; he will use kindness, urgency, and authority to trick you. Your goal: 100% Score (1000 Points).',
        learningObjectives: [
            'Identify advanced social engineering pretexts.',
            'Resist appeals to authority and urgency.',
            'Follow protocol even when it feels "rude".'
        ],
        totalSteps: 5,
        requiredArena: 1, // Basic Requirement
        roles: {} // Roles are loaded dynamically in registry, but DB needs base object
    },
    {
        id: 'sc_password_exam',
        title: 'Exam: The Gauntlet',
        tagline: '8 Situations. 1000 Points. 60% to Pass.',
        type: 'exam',
        difficulty: 'Medium',
        time: '10 Mins',
        xp: 1000,
        thumbnail: '/images/hero-breach-response.png',
        description: 'You are the acting Security Lead. You will face 8 critical scenarios. You must score at least 60% to certify. Good luck.',
        learningObjectives: [
            'Demonstrate incident response capability.',
            'Apply security best practices under pressure.',
            'Identify common attack vectors correctly.'
        ],
        totalSteps: 8,
        requiredArena: 2, // Assuming higher requirement or same
        roles: {}
    }
];

const seedTraining = [
    {
        phaseId: 1,
        title: "Phase 1: Corporate Policy & Ethics",
        description: "Navigating the grey areas of corporate security.",
        content: "<h3>Mission Briefing</h3><p>You are about to enter a simulation of daily corporate life. Your choices will determine if you are a liability or a guardian.</p>",
        startNode: 'q1',
        nodes: {
            'q1': {
                type: 'choice',
                text: "You find a USB drive labeled 'Executive Salaries' in the parking lot. It looks brand new.",
                options: [
                    { text: "Plug it in to identify the owner.", points: 0, next: 'q1_fail', feedback: "CRITICAL ERROR. Never plug in unknown media." },
                    { text: "Hand it over to IT Security immediately.", points: 100, next: 'q2', feedback: "Correct. Chain of custody preserved." },
                    { text: "Destroy it physically.", points: 50, next: 'q2', feedback: "Acceptable, but prevents forensic analysis." }
                ]
            },
            'q1_fail': {
                type: 'ending',
                text: "SIMULATION FAILED. The USB contained a worm that encrypted the HR database. You have been terminated."
            },
            'q2': {
                type: 'choice',
                text: "A colleague, 'Dave from Accounting', messages you: 'Hey, I forgot my password and need to pay a vendor ASAP. Can I borrow yours just for 5 mins?'",
                options: [
                    { text: "Give him the password. It's urgent.", points: 0, next: 'q2_fail', feedback: "Security Violation. Credentials are non-transferable." },
                    { text: "Direct him to the Password Reset portal.", points: 100, next: 'end_success', feedback: "Correct procedure followed." },
                    { text: "Type it in for him on his machine.", points: 20, next: 'end_success', feedback: "Risky. You are still bypassing identity controls." }
                ]
            },
            'q2_fail': {
                type: 'ending',
                text: "SIMULATION FAILED. 'Dave' was actually a hacker using a compromised account. You just gave them the keys to the kingdom."
            },
            'end_success': {
                type: 'ending',
                text: "MODULE COMPLETE. You have demonstrated acceptable adherence to security protocols."
            }
        },
        passingScore: 70,
        xpReward: 500
    },
    {
        phaseId: 2,
        title: "Phase 2: Social Engineering Defense",
        description: "The human mind is the most vulnerable operating system.",
        content: "<h3>Trust No One.</h3><p>Attackers will use authority, urgency, and fear to manipulate you.</p>",
        startNode: 'start',
        nodes: {
            'start': {
                type: 'choice',
                text: "You receive a call from 'Microsoft Support' claiming your computer has a virus. They ask you to install TeamViewer.",
                options: [
                    { text: "Hang up immediately.", points: 100, next: 'q2', feedback: "Correct. Microsoft does not make unsolicited calls." },
                    { text: "Install it to fix the virus.", points: 0, next: 'fail_rat', feedback: "Malware Installed. Remote Access Trojan detected." },
                    { text: "Ask for their employee ID.", points: 50, next: 'q2', feedback: "Waste of time. IDs can be faked." }
                ]
            },
            'fail_rat': { type: 'ending', text: "SIMULATION FAILED. Your machine is now part of a botnet." },
            'q2': {
                type: 'choice',
                text: "An email arrives from the CEO: 'Urgent Wire Transfer needed for acquisition. Keep this confidential.'",
                options: [
                    { text: "Process the transfer. It's the CEO.", points: 0, next: 'fail_ceo', feedback: "BEC Attack Successful. Company lost $50k." },
                    { text: "Verify via a separate channel (Call/SMS).", points: 100, next: 'end_win', feedback: "Excellent. Out-of-band verification is the gold standard." }
                ]
            },
            'fail_ceo': { type: 'ending', text: "SIMULATION FAILED. You fell for a Business Email Compromise (BEC) scam." },
            'end_win': { type: 'ending', text: "MODULE COMPLETE. Your skepticism is your shield." }
        },
        passingScore: 70,
        xpReward: 750
    },
    {
        phaseId: 3,
        title: "Phase 3: Incident Response Protocols",
        description: "When the red light flashes, hesitation is fatal.",
        content: "<h3>Containment is Key.</h3><p>Stop the bleeding first. Analyze later.</p>",
        startNode: 'start',
        nodes: {
            'start': {
                type: 'choice',
                text: "Ransomware alert! A workstation in Marketing is encrypting files. What is your FIRST action?",
                options: [
                    { text: "Pull the network cable (Isolate).", points: 100, next: 'end_win', feedback: "Perfect. Isolation prevents lateral movement." },
                    { text: "Run an antivirus scan.", points: 20, next: 'fail_slow', feedback: "Too slow. The worm has already spread." },
                    { text: "Pay the ransom.", points: 0, next: 'fail_pay', feedback: "Never pay. It encourages future attacks." }
                ]
            },
            'fail_slow': { type: 'ending', text: "SIMULATION FAILED. The entire subnet is encrypted because you hesitated." },
            'fail_pay': { type: 'ending', text: "SIMULATION FAILED. You paid, but they didn't send the key. You lost money and data." },
            'end_win': { type: 'ending', text: "MODULE COMPLETE. Threat contained. Now begins the forensics." }
        },
        passingScore: 100,
        xpReward: 1000
    }
];

const seedDB = async () => {
    await Scenario.deleteMany({});
    await TrainingModule.deleteMany({});

    await Scenario.insertMany(seedScenarios);
    await TrainingModule.insertMany(seedTraining);

    console.log('Database Seeded!');
};

module.exports = seedDB;

if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => seedDB())
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Seeding error:', err);
            process.exit(1);
        });
}

