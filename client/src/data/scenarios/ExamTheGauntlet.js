// Exam: The Gauntlet
// Format: Linear (8 Questions)
// Pass Mark: 60% (600/1000 XP)

const ExamTheGauntlet = {
    id: 'sc_password_exam',
    title: 'Exam: The Gauntlet',
    tagline: '8 Situations. 1000 Points. 60% to Pass.',
    type: 'exam', // Disables Judge Feedback in standard runner, handled by wrapper
    difficulty: 'Intermediate',
    time: '10 Mins',
    xp: 1000,
    thumbnail: '/images/hero-breach-response.png',
    description: 'You are the acting Security Lead. You will face 8 critical scenarios. You must score at least 60% to certify. Good luck.',
    learningObjectives: [
        'Demonstrate incident response capability.',
        'Apply security best practices under pressure.',
        'Identify common attack vectors correctly.'
    ],
    completed: false,
    totalSteps: 8,
    roles: {
        analyst: {
            id: 'analyst',
            title: 'Security Lead',
            type: 'Tactical',
            avatar: '/images/hero-commander.png',
            shortDescription: 'Make the tough calls.',
            fullDescription: 'The organization is counting on your judgment.',
            focus: 'Decision Making',
            startNode: 'q1_phishing',
            nodes: {
                // QUESTION 1: PHISHING
                q1_phishing: {
                    id: 'q1_phishing',
                    text: 'SITUATION 1/8: PHISHING ANALYSIS\n\nA user reports a suspicious email from "IT Support" asking for a password reset. You check the headers.\n\nFrom: support@micros0ft.com\nReply-To: external-mail-service@gmail.com\nLink: bit.ly/reset-now\n\nWhat is the "Smoking Gun" that confirms this is malicious?',
                    data: [],
                    options: [
                        {
                            text: 'The bit.ly link (Shorteners are always malicious).',
                            next: 'q2_ransomware',
                            points: 0
                        },
                        {
                            text: 'The "micros0ft.com" domain (Typo-squatting).',
                            next: 'q2_ransomware',
                            points: 125
                        },
                        {
                            text: 'The Reply-To address (It fails DMARC alignment).',
                            next: 'q2_ransomware',
                            points: 0
                        }
                    ]
                },

                // QUESTION 2: RANSOMWARE
                q2_ransomware: {
                    id: 'q2_ransomware',
                    text: 'SITUATION 2/8: RANSOMWARE\n\nA panicked HR employee calls: "My screen is red and it says all my files are encrypted! It is asking for Bitcoin!"\n\nWhat is your IMMEDIATE first action?',
                    data: [],
                    options: [
                        {
                            text: 'Pay the ransom immediately to get the data back.',
                            next: 'q3_mfa',
                            points: 0
                        },
                        {
                            text: 'Reboot the computer to clear the memory.',
                            next: 'q3_mfa',
                            points: 0
                        },
                        {
                            text: 'Disconnect the computer from the network (Unplug Ethernet/WiFi).',
                            next: 'q3_mfa',
                            points: 125
                        }
                    ]
                },

                // QUESTION 3: MFA FATIGUE
                q3_mfa: {
                    id: 'q3_mfa',
                    text: 'SITUATION 3/8: MFA FLOOD\n\nThe CEO is complaining that his phone is "blowing up" with MFA approval notifications at 2:00 AM. He is about to click "Approve" just to make it stop.\n\nWhat is the correct response?',
                    data: [],
                    options: [
                        {
                            text: 'Tell him to click Approve so you can track the hacker.',
                            next: 'q4_usb',
                            points: 0
                        },
                        {
                            text: 'Instruct him to DENY the requests and temporarily lock his account.',
                            next: 'q4_usb',
                            points: 125
                        },
                        {
                            text: 'Tell him to turn off his phone and go back to sleep.',
                            next: 'q4_usb',
                            points: 0
                        }
                    ]
                },

                // QUESTION 4: USB SECURITY
                q4_usb: {
                    id: 'q4_usb',
                    text: 'SITUATION 4/8: THE PARKING LOT\n\nYou find a USB drive labeled "Executive Salaries 2024" in the company parking lot. You are curious.\n\nWhat is the safest way to handle this?',
                    data: [],
                    options: [
                        {
                            text: 'Plug it in to see if the files are real.',
                            next: 'q5_wifi',
                            points: 0
                        },
                        {
                            text: 'Plug it in but hold "Shift" to stop AutoRun.',
                            next: 'q5_wifi',
                            points: 0
                        },
                        {
                            text: 'Do not plug it in. Destroy it or hand it to the forensic team.',
                            next: 'q5_wifi',
                            points: 125
                        }
                    ]
                },

                // QUESTION 5: PUBLIC WIFI
                q5_wifi: {
                    id: 'q5_wifi',
                    text: 'SITUATION 5/8: REMOTE WORK\n\nYou are at the airport and need to access the corporate server. The only available network is "Free_Airport_WiFi".\n\nHow do you proceed?',
                    data: [],
                    options: [
                        {
                            text: 'Connect to the WiFi and log in normally.',
                            next: 'q6_pass',
                            points: 0
                        },
                        {
                            text: 'Connect to the WiFi, but ONLY use a corporate VPN (Virtual Private Network).',
                            next: 'q6_pass',
                            points: 125
                        },
                        {
                            text: 'Use the WiFi but use Incognito Mode.',
                            next: 'q6_pass',
                            points: 0
                        }
                    ]
                },

                // QUESTION 6: PASSWORD STRENGTH
                q6_pass: {
                    id: 'q6_pass',
                    text: 'SITUATION 6/8: CREDENTIALS\n\nWhich of these passwords would take the longest for a hacker to crack?',
                    data: [],
                    options: [
                        {
                            text: 'P@ssw0rd123! (Complex but short)',
                            next: 'q7_insider',
                            points: 0
                        },
                        {
                            text: 'correct-horse-battery-staple (Long Passphrase)',
                            next: 'q7_insider',
                            points: 125
                        },
                        {
                            text: 'Admin2024 (Predictable)',
                            next: 'q7_insider',
                            points: 0
                        }
                    ]
                },

                // QUESTION 7: INSIDER THREAT
                q7_insider: {
                    id: 'q7_insider',
                    text: 'SITUATION 7/8: DATA EXFILTRATION\n\nOur DLP (Data Loss Prevention) system alerts that a sales employee is uploading 50GB of data to a personal Google Drive at 11:00 PM on a Friday. They resigned yesterday.\n\nWhat is this classified as?',
                    data: [],
                    options: [
                        {
                            text: 'Insider Threat / Data Theft.',
                            next: 'q8_social',
                            points: 125
                        },
                        {
                            text: 'Standard Backup Procedure.',
                            next: 'q8_social',
                            points: 0
                        },
                        {
                            text: 'Cloud Sync Error.',
                            next: 'q8_social',
                            points: 0
                        }
                    ]
                },

                // QUESTION 8: SOCIAL ENGINEERING
                q8_social: {
                    id: 'q8_social',
                    text: 'SITUATION 8/8: THE PHONE CALL\n\nA caller claims to be from the "Help Desk" and says they need your password to install an urgent security patch to fix your computer.\n\nWhat is the rule?',
                    data: [],
                    options: [
                        {
                            text: 'Give them the password, but change it immediately after.',
                            next: 'finish',
                            points: 0
                        },
                        {
                            text: 'IT Support will NEVER ask for your password. Hang up.',
                            next: 'finish',
                            points: 125
                        },
                        {
                            text: 'Ask for their employee ID first.',
                            next: 'finish',
                            points: 0
                        }
                    ]
                },

                // FINISH
                finish: {
                    type: 'ending',
                    text: 'EXAM COMPLETE.\n\nSubmitting your answers for grading...',
                    outcome: 'calculated', // Handled by Phase4Exam.js score check
                    stars: 3
                }
            }
        }
    }
};

export default ExamTheGauntlet;
