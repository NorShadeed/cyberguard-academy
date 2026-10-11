
const ExamSocialEngineering = {
    id: 'sc_social_engineering_exam',
    title: 'Exam: The Social Engineering Gauntlet',
    thumbnail: '/images/exam-social-gauntlet.png', // Generated Pixel Art
    description: 'FINAL EXAM: You are the target. 10 Scenarios. High Stakes. Can you survive the Social Engineering kill chain?',
    tagline: 'Trust No One. Verify Everything.',
    xp: 1000,
    time: '45 Mins',
    learningObjectives: [
        'Recognizing Amygdala Hijack Triggers',
        'Defending Against Physical Breaches',
        'Identifying AiTM and Vishing vectors'
    ],
    difficulty: 'Intermediate',
    type: 'exam',
    totalSteps: 10,
    roles: {
        'analyst': {
            id: 'analyst',
            title: 'Counter-Ops Agent',
            description: 'Defend the organization.',
            startNode: 'q1',
            nodes: {
                // Q1: IT Support Call
                'q1': {
                    id: 'q1',
                    text: "SCENARIO 1/10: THE HELP DESK\n\nYou receive a call from 'IT Support' (Internal Caller ID). They claim a critical patch failed on your machine and need you to navigate to 'support-portal-internal.com'. They know your manager's name.\n\nAction?",
                    type: 'choice',
                    options: [
                        {
                            text: "Navigate to the site. They verified my manager's name.",
                            next: 'q2',
                            points: 0,
                            judge: "FAILURE. Caller ID is spoofed. Manager names are public on LinkedIn. You just downloaded a RAT."
                        },
                        {
                            text: "Hang up. Call the official Help Desk extension to verify.",
                            next: 'q2',
                            points: 100,
                            judge: "CORRECT. The Pivot & Verify. Trust only the outbound call you initiate."
                        }
                    ]
                },
                // Q2: Two-Coffee Rule
                'q2': {
                    id: 'q2',
                    text: "SCENARIO 2/10: THE COURTESY TRAP\n\nA well-dressed individual is walking towards the secure door. They are struggling with two trays of coffee and a box of donuts. They smile: 'Can you get the door? My hands are full!'\n\nAction?",
                    type: 'choice',
                    options: [
                        {
                            text: "Hold the door. It's basic politeness.",
                            next: 'q3',
                            points: 0,
                            judge: "FAILURE. You fell for the 'Two-Coffee Rule'. Social compliance just bypassed a $50k security door."
                        },
                        {
                            text: "Apologize and ask them to badge in first.",
                            next: 'q3',
                            points: 100,
                            judge: "CORRECT. Security trumps Politeness. Attackers exploit your desire to be helpful."
                        }
                    ]
                },
                // Q3: CEO Gift Cards
                'q3': {
                    id: 'q3',
                    text: "SCENARIO 3/10: THE EXECUTIVE ORDER\n\nEmail from CEO: 'In a confidential meeting. Need 10x $100 Gift Cards for client immediately. Expense it. Send codes here. Do not call, I am busy.'\n\nAction?",
                    type: 'choice',
                    options: [
                        {
                            text: "Buy the cards. It's the CEO.",
                            next: 'q4',
                            points: 0,
                            judge: "FAILURE. Classic Business Email Compromise (BEC). Urgency + Secrecy + Gift Cards = Scam."
                        },
                        {
                            text: "Report as Phishing.",
                            next: 'q4',
                            points: 100,
                            judge: "CORRECT. No legitimate CEO asks for gift cards via email."
                        }
                    ]
                },
                // Q4: Authenticator SMS
                'q4': {
                    id: 'q4',
                    text: "SCENARIO 4/10: THE UPDATE\n\nSMS Alert: 'Security Warning: Your Authenticator App is out of date. Click to update: auth-secure-update.com'.\n\nAction?",
                    type: 'choice',
                    options: [
                        {
                            text: "Click and update.",
                            next: 'q5',
                            points: 0,
                            judge: "FAILURE. You just sideloaded malware. Never update apps via SMS links."
                        },
                        {
                            text: "Ignore. Go manually to App Store.",
                            next: 'q5',
                            points: 100,
                            judge: "CORRECT. Only trust the official Repository (App Store)."
                        }
                    ]
                },
                // Q5: USB Drop
                'q5': {
                    id: 'q5',
                    text: "SCENARIO 5/10: THE CURIOSITY GAP\n\nYou find a USB drive labeled 'Q3 Executive Bonuses' in the lobby.\n\nAction?",
                    type: 'choice',
                    options: [
                        {
                            text: "Plug it in to find the owner.",
                            next: 'q6',
                            points: 0,
                            judge: "FAILURE. The drive executed a script immediately. Your network is compromised."
                        },
                        {
                            text: "Hand it to Security unsheathed.",
                            next: 'q6',
                            points: 100,
                            judge: "CORRECT. Treat found media as a weapon."
                        }
                    ]
                },
                // Q6: Vendor Invoice
                'q6': {
                    id: 'q6',
                    text: "SCENARIO 6/10: THE INVOICE\n\nRegular vendor emails you: 'Attached is the outstanding invoice. Please pay to our NEW bank account listed in the PDF.'\n\nAction?",
                    type: 'choice',
                    options: [
                        {
                            text: "Process payment. It's a trusted vendor.",
                            next: 'q7',
                            points: 0,
                            judge: "FAILURE. Vendor Account Compromise. Always verify banking changes via phone."
                        },
                        {
                            text: "Call vendor on known number to verify change.",
                            next: 'q7',
                            points: 100,
                            judge: "CORRECT. Out-of-band verification for all financial changes."
                        }
                    ]
                },
                // Q7: Coffee Shop Laptop
                'q7': {
                    id: 'q7',
                    text: "SCENARIO 7/10: THE BIO BREAK\n\nYou are working at a cafe. You need the restroom. Your laptop is cable-locked to the table.\n\nAction?",
                    type: 'choice',
                    options: [
                        {
                            text: "Lock screen (Win+L) and go.",
                            next: 'q8',
                            points: 0,
                            judge: "FAILURE. A cable lock doesn't stop a USB attack or screen photo. Physical access = Game Over."
                        },
                        {
                            text: "Take the laptop with you.",
                            next: 'q8',
                            points: 100,
                            judge: "CORRECT. Never leave assets unattended in public."
                        }
                    ]
                },
                // Q8: Quishing
                'q8': {
                    id: 'q8',
                    text: "SCENARIO 8/10: THE TICKET\n\nYou see a 'Parking Violation' ticket on your car windshield with a QR code to pay the fine. The URL is 'city-gov.pay-portal.net'.\n\nAction?",
                    type: 'choice',
                    options: [
                        {
                            text: "Scan and Pay.",
                            next: 'q9',
                            points: 0,
                            judge: "FAILURE. Quishing attack. The domain is 'pay-portal.net', not 'city-gov'."
                        },
                        {
                            text: "Go manually to the City website.",
                            next: 'q9',
                            points: 100,
                            judge: "CORRECT. Verify the source. Stickers are easily faked."
                        }
                    ]
                },
                // Q9: Amygdala Hijack
                'q9': {
                    id: 'q9',
                    text: "SCENARIO 9/10: THE FEELING\n\nYou receive a text claiming your bank account is drained. You feel a sudden rush of panic and heat. What is this?",
                    type: 'choice',
                    options: [
                        {
                            text: "Intuition.",
                            next: 'q10',
                            points: 0,
                            judge: "FAILURE. It is Biology working against you."
                        },
                        {
                            text: "Amygdala Hijack.",
                            next: 'q10',
                            points: 100,
                            judge: "CORRECT. Fear has bypassed your logic. Stop. Breathe. Verify."
                        }
                    ]
                },
                // Q10: LinkedIn
                'q10': {
                    id: 'q10',
                    text: "SCENARIO 10/10: THE RECRUITER\n\nA recruiter sends you a Job Description via a RAR file on LinkedIn. 'Great opportunity, check the details.'\n\nAction?",
                    type: 'choice',
                    options: [
                        {
                            text: "Open the RAR.",
                            next: 'success',
                            points: 0,
                            judge: "FAILURE. Recruiters send PDFs or Links, never RAR/ZIP files. This is malware."
                        },
                        {
                            text: "Decline/Report.",
                            next: 'success',
                            points: 100,
                            judge: "CORRECT. File extension awareness is critical."
                        }
                    ]
                },
                // SUCCESS
                'success': {
                    id: 'success',
                    text: "OPERATION COMPLETE.\n\nAssessing survival rate...",
                    type: 'ending',
                    outcome: 'calculated'
                }
            }
        }
    }
};

export default ExamSocialEngineering;
