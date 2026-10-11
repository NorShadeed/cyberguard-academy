const ExamPhishingGauntlet = {
    id: 'sc_phishing_gauntlet',
    title: 'Exam: The Phishing Gauntlet',
    thumbnail: '/images/mission-phishing-gauntlet.png',
    description: 'FINAL EXAM: Advanced threats have bypassed the gateway. You are the last line of defense. 5 Scenarios. 2000 XP. 100% Accuracy Required.',
    tagline: 'Defeat the "Perfect" Phish.',
    xp: 800,
    time: '30 Mins',
    learningObjectives: [
        'Detecting AiTM / MFA Bypass Attacks',
        'Identifying Deepfake Audio Cues',
        'Recognizing OAuth Consent Abuse'
    ],
    difficulty: 'Intermediate',
    type: 'exam',
    totalSteps: 5,
    roles: {
        'analyst': {
            id: 'analyst',
            title: 'Cyber Analyst',
            description: 'Defense against dark arts.',
            startNode: 'q1_aitm',
            nodes: {

                // -----------------------------------------------------------------
                // Q1: AiTM (The MFA Bypass) - ATTACK
                // -----------------------------------------------------------------
                'q1_aitm': {
                    id: 'q1_aitm',
                    text: "SCENARIO 1/5: THE SSO PROMPT\n\nIt's 8:30 AM. You receive a Teams notification that your session has expired. You are redirected to a Microsoft 365 login page.\n\nThe page looks identical to your organization's portal. It even includes your company logo.\n\nURL: `https://sso-microsoft-update.com/auth/login`\n\nAction?",
                    type: 'choice',
                    options: [
                        {
                            text: "Log in normally. The page has the correct company branding.",
                            next: 'q2_deepfake',
                            points: 0,
                            judge: "FAILURE. You ignored the URL. Company branding is easily scraped. 'sso-microsoft-update.com' is a malicious domain hosting an AiTM proxy."
                        },
                        {
                            text: "Flag as suspicious. The domain is not 'microsoftonline.com'.",
                            next: 'q2_deepfake',
                            points: 400,
                            judge: "CORRECT. The domain is the only truth. This is a classic Evilginx2 attack vector."
                        }
                    ]
                },

                // -----------------------------------------------------------------
                // Q2: IT SUPPORT CALLBACK - *SAFE*
                // -----------------------------------------------------------------
                'q2_deepfake': {
                    id: 'q2_deepfake',
                    text: "SCENARIO 2/5: THE IT TICKET\n\nYou submitted a ticket 'Unable to Access VPN' 5 minutes ago via the official portal (Ticket #9921).\n\nYour desk phone rings. Internal Extension 4004 (Help Desk).\n\n'Hi, this is Mike. I'm looking at ticket #9921 regarding your VPN. Can you confirm your Employee ID so I can reset the adapter?'",
                    type: 'choice',
                    options: [
                        {
                            text: "Provide ID. The context and source match.",
                            next: 'q3_oauth',
                            points: 400,
                            judge: "CORRECT. This is a legitimate verification. He called on an internal line and cited specific non-public ticket details immediately after you submitted it."
                        },
                        {
                            text: "Hang up and report. He asked for my ID.",
                            next: 'q3_oauth',
                            points: 0,
                            judge: "FALSE POSITIVE. Excessive paranoia hinders operations. He verified himself by knowing your fresh ticket number."
                        }
                    ]
                },

                // -----------------------------------------------------------------
                // Q3: OAUTH PHISHING - ATTACK
                // -----------------------------------------------------------------
                'q3_oauth': {
                    id: 'q3_oauth',
                    text: "SCENARIO 3/5: THE INTEGRATION\n\nYou receive an invite to collaborate on a 'Q4 Budget' document via SharePoint. \n\nUpon clicking, a standard Microsoft permission prompt appears:\n\n**App Name:** 'Office 365 Document Enhancer'\n**Permissions:** 'Read all files', 'Sign in as you', 'Send mail as you'.\n\nThere is no password field, just an [Accept] button.",
                    type: 'choice',
                    options: [
                        {
                            text: "Accept. It's a Microsoft system prompt.",
                            next: 'q4_quishing',
                            points: 0,
                            judge: "FAILURE. You fell for Consent Phishing. The prompt is real, but the App is malicious. You just granted an attacker full control of your inbox via OAuth token."
                        },
                        {
                            text: "Deny and Report. The permissions are excessive.",
                            next: 'q4_quishing',
                            points: 400,
                            judge: "CORRECT. Never grant 'Read all files' or 'Send mail' permissions to unknown Third-Party Apps."
                        }
                    ]
                },

                // -----------------------------------------------------------------
                // Q4: LEAST PRIVILEGE APP - *SAFE*
                // -----------------------------------------------------------------
                'q4_quishing': {
                    id: 'q4_quishing',
                    text: "SCENARIO 4/5: THE PRODUCTIVITY TOOL\n\nYour manager suggests installing 'FocusTimer' from the Chrome Web Store to track sprints.\n\nYou check the granular permissions:\n**Permissions:** 'Display notifications', 'Play sounds'.\n**Data Access:** None.\n\nAction?",
                    type: 'choice',
                    options: [
                        {
                            text: "Install. The permissions are low-risk.",
                            next: 'q5_homograph',
                            points: 400,
                            judge: "CORRECT. This follows the principle of Least Privilege. The app cannot access sensitive data."
                        },
                        {
                            text: "Block. Any browser extension is a threat.",
                            next: 'q5_homograph',
                            points: 0,
                            judge: "FALSE POSITIVE. Blanket blocking low-risk, approved tools reduces productivity. Assess the actual permissions risk."
                        }
                    ]
                },

                // -----------------------------------------------------------------
                // Q5: HOMOGRAPH - ATTACK
                // -----------------------------------------------------------------
                'q5_homograph': {
                    id: 'q5_homograph',
                    text: "SCENARIO 5/5: THE INTERNAL TOOL\n\nAn alert asks you to verify your payroll details.\n\nLink: `https://www.workday-internal.com/verify`\n\nIt looks correct at a glance. You check the SSL certificate, it is valid.\n\nProceed?",
                    type: 'choice',
                    options: [
                        {
                            text: "Yes, SSL is valid and the name looks right.",
                            next: 'success',
                            points: 0,
                            judge: "FAILURE. Attackers can buy SSL certs too. 'workday-internal.com' is a cybersquatting domain. The real domain is 'workday.com' or 'my-company.workday.com'."
                        },
                        {
                            text: "No. The domain structure is suspicious.",
                            next: 'success',
                            points: 400,
                            judge: "CORRECT. Always verify the root domain. Adding 'internal' or 'secure' to a domain name is a common trick to look legitimate."
                        }
                    ]
                },

                // -----------------------------------------------------------------
                // SUCCESS
                // -----------------------------------------------------------------
                'success': {
                    id: 'success',
                    text: "GAUNTLET COMPLETE.\n\nYour responses have been logged. Calculating final assessment...",
                    type: 'ending',
                    outcome: 'calculated'
                }
            }
        }
    }
};

export default ExamPhishingGauntlet;
