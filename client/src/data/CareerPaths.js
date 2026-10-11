import { FaShieldAlt, FaSearch, FaBug, FaNetworkWired, FaUserSecret } from 'react-icons/fa';

export const CAREER_PATHS = [
    {
        id: 'corp-defender',
        title: 'Corporate Defender',
        subtitle: 'Security Awareness for Everyone',
        description: 'You are the first line of defense. Learn how to protect yourself and your company from social engineering, phishing, and physical threats.',
        role: 'Security Champion',
        difficulty: 'Beginner',
        estimatedTime: '3 Hours',
        xpTotal: 15000,
        color: '#ff0055', // Red/Pink
        icon: <FaUserSecret />,
        details: {
            summary: "You are the first line of defense. Learn how to protect yourself and your company from social engineering, phishing, and physical threats.",
            learningObjectives: [
                "Identify social engineering tactics.",
                "Secure personal and corporate devices.",
                "Recognize and report phishing attempts."
            ],
            targetAudience: "All Employees, Non-Tech Staff"
        },
        nodes: [
            {
                id: 'security-awareness',
                title: 'Cyber Awareness Fundamentals',
                type: 'course',
                description: 'The frontline defense. Training on Phishing, Social Engineering, and Security.',
                xp: 2700,
                status: 'unlocked',
                position: { x: 10, y: 50 },
                catalogId: 'security-awareness',
                details: {
                    summary: 'The frontline defense against cyber threats. Detailed training on Phishing, Social Engineering, and Physical Security.',
                    learningObjectives: [
                        'Analyze email headers and bodies for hidden phishing indicators',
                        'Identify psychological manipulation tactics in real-time',
                        'Secure physical workspaces against unauthorized access',
                        'Respond correctly to simulated social engineering attacks',
                        'Protect corporate credentials and 2FA codes'
                    ],
                    targetAudience: 'All Employees (Corporate Defender Track)'
                }
            },
            {
                id: 'course-passwords',
                title: 'Password Mastery',
                type: 'course',
                description: 'Creating uncrackable passwords and managing them.',
                xp: 2950,
                status: 'locked',
                position: { x: 30, y: 30 },
                catalogId: 'password-mastery',
                connections: ['security-awareness']
            },
            {
                id: 'course-phishing-adv',
                title: 'Advanced Phishing Defense',
                type: 'course',
                description: 'Analyze complex spear-phishing and whaling attacks.',
                catalogId: 'phishing-defense',
                xp: 2800,
                status: 'locked',
                position: { x: 50, y: 70 },
                connections: ['course-passwords']
            },
            {
                id: 'course-social-eng',
                title: 'Social Engineering Ops',
                type: 'course',
                description: 'Countering human-intelligence operations and pretexting.',
                catalogId: 'social-engineering-ops',
                xp: 3400,
                status: 'locked',
                position: { x: 70, y: 50 },
                connections: ['course-phishing-adv']
            },
            {
                id: 'course-digital-life',
                title: 'Digital Life Security',
                type: 'course',
                description: 'Mobile defense, remote work security, and digital privacy.',
                xp: 2800,
                status: 'locked',
                catalogId: 'digital-life-security',
                position: { x: 90, y: 50 },
                connections: ['course-social-eng']
            }
        ]
    },
    {
        id: 'soc-analyst-1',
        title: 'SOC Analyst Level 1',
        subtitle: 'The First Line of Defense',
        description: 'Master the art of intrusion detection, log analysis, and incident triage. Become the shield that protects the organization.',
        role: 'Blue Team Defender',
        difficulty: 'Beginner',
        estimatedTime: '40 Hours',
        xpTotal: 15000,
        color: '#00d4ff', // Cyan
        isComingSoon: true,
        icon: <FaShieldAlt />,
        // Extended Info for Header
        details: {
            summary: "Master the art of intrusion detection, log analysis, and incident triage. Become the shield that protects the organization.",
            learningObjectives: [
                "Analyze network traffic for suspicious anomalies.",
                "Investigate alerts using SIEM and EDR tools.",
                "Respond to live cyber attacks in real-time simulations."
            ],
            targetAudience: "Aspiring Analysts, IT Admins"
        },
        nodes: [
            {
                id: 'module-1',
                title: 'Cyber Defense Foundations',
                type: 'module',
                description: 'Core concepts of the Blue Team operations.',
                xp: 500,
                status: 'unlocked',
                position: { x: 15, y: 50 } // Start left
            },
            {
                id: 'module-2',
                title: 'Network Traffic Analysis',
                type: 'module',
                description: 'Deep dive into packet capture and Wireshark.',
                xp: 800,
                status: 'locked',
                position: { x: 35, y: 30 } // Branch up slightly  
            },
            {
                id: 'scenario-Phishing',
                title: 'Live Sim: Phishing Attack',
                type: 'scenario',
                description: 'Investigate a reported phishing campaign.',
                xp: 1200,
                status: 'locked',
                position: { x: 55, y: 15 } // Higher branch
            },
            {
                id: 'module-3',
                title: 'Endpoint Security',
                type: 'module',
                description: 'EDR logs and host-based forensics.',
                xp: 800,
                status: 'locked',
                position: { x: 55, y: 85 } // Lower branch  
            },
            {
                id: 'scenario-ZeroDay',
                title: 'Operation Zero Day Meltdown',
                type: 'scenario',
                description: 'Full scale incident response simulation.',
                xp: 2500,
                status: 'locked',
                position: { x: 75, y: 50 } // Reconverge center
            },
            {
                id: 'cert-soc1',
                title: 'SOC Analyst L1 Certification',
                type: 'certification',
                description: 'Final Exam and Credential.',
                xp: 5000,
                status: 'locked',
                position: { x: 95, y: 50 }
            }
        ]
    }
];
