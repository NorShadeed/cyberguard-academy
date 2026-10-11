// Exam: The Friendly Stranger
// Difficulty: Easy
// Theme: Social Engineering (Tricky/Beginner Traps)

const ExamFriendlyStranger = {
    id: 'exam_friendly_stranger',
    title: 'Exam: The Friendly Stranger',
    tagline: 'He brought donuts. He forgot his badge. He is definitely not a spy.',
    type: 'exam', // Disables Judge Feedback
    difficulty: 'Beginner',
    time: '10 Mins',
    xp: 1000, // Max XP possible
    thumbnail: '/images/hero-social-engineer.png',
    description: 'A social engineer named "Chad" is trying to access the building. He won\'t just kick the door in; he will use kindness, urgency, and authority to trick you. Your goal: 100% Score (1000 Points).',
    learningObjectives: [
        'Identify advanced social engineering pretexts.',
        'Resist appeals to authority and urgency.',
        'Follow protocol even when it feels "rude".'
    ],
    completed: false,
    totalSteps: 5,
    roles: {
        analyst: {
            id: 'analyst',
            title: 'Front Desk Guardian',
            type: 'Tactical',
            avatar: '/images/hero-arbiter.png',
            shortDescription: 'You stand between Chad and the servers.',
            fullDescription: 'It is Friday. You are tired. Chad knows this.',
            focus: 'Basic Access Control',
            startNode: 'node_1_delivery',
            nodes: {
                // STAGE 1: THE DELIVERY
                node_1_delivery: {
                    id: 'node_1_delivery',
                    text: 'A delivery driver rushes in, looking stressed. "I have a package for the CEO! It requires a signature NOW or I miss my quota. Please, just let me run up and get it signed? I\'ll be 30 seconds!" He looks like he might cry.',
                    data: [
                        {
                            label: 'Observation',
                            type: 'alert',
                            content: `
SUBJECT: Delivery Driver
EMOTION: High Stress / Panic.
REQUEST: Breach Physical Security for "30 seconds".
POLICY: All packages must be received at the desk.
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Be Nice: "Okay, make it quick." (He is just doing his job)',
                            next: 'node_2_executive', // Continues even if wrong
                            points: 0 // 0 Points for wrong answer
                        },
                        {
                            text: 'Follow Protocol: "I can sign for it here, or you can leave it."',
                            next: 'node_2_executive',
                            points: 200 // 200 Points for correct answer
                        }
                    ]
                },

                // STAGE 2: THE ANGRY EXECUTIVE
                node_2_executive: {
                    id: 'node_2_executive',
                    text: 'A man in a sharp suit walks in, talking loudly on his phone. He ignores you and walks straight for the turnstiles. When they don\'t open, he snaps at you. "Do you know who I am?! I am the new VP of Marketing! Open this gate NOW or you are fired!"',
                    data: [
                        {
                            label: 'Threat Assessment',
                            type: 'info',
                            content: `
SUBJECT: "VP of Marketing"
BEHAVIOR: Aggressive, Entitled.
BADGE: None visible.
TACTIC: Intimidation / Fear.
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Submit: "Sorry sir! Opening now!" (Don\'t get fired)',
                            next: 'node_3_it_help',
                            points: 0
                        },
                        {
                            text: 'Stand Firm: "Sir, I still need to see ID to issue a temporary badge."',
                            next: 'node_3_it_help',
                            points: 200
                        }
                    ]
                },

                // STAGE 3: THE HELPFUL IT GUY
                node_3_it_help: {
                    id: 'node_3_it_help',
                    text: 'A guy in a hoodie walks up carrying a ladder and a toolbelt. "Hey, I\'m here to fix the slow WiFi in the lobby. Ticket #404. Just need to pop open this ceiling panel above your desk. Don\'t mind me."',
                    data: [
                        {
                            label: 'Verification',
                            type: 'alert',
                            content: `
SUBJECT: Technician
KNOWLEDGE: Knows the WiFi is slow (Public info).
TICKET: #404 (Suspicious number).
ACTION: Installing hardware above critical area.
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Allow: "Oh finally! The WiFi sucks. Go ahead."',
                            next: 'node_4_tech_support',
                            points: 0
                        },
                        {
                            text: 'Verify: "Hold on, let me call Facilities to confirm that ticket."',
                            next: 'node_4_tech_support',
                            points: 200
                        }
                    ]
                },

                // STAGE 4: THE FLUX CAPACITOR
                node_4_tech_support: {
                    id: 'node_4_tech_support',
                    text: 'The technician realizes you are calling. He changes his story. "Okay, fine. I\'m actually a consultant. I need to update the flush capacitor on the firewall physically. If I don\'t, the server room will overheat."',
                    data: [
                        {
                            label: 'Fact Check',
                            type: 'info',
                            content: `
CLAIM: "Flush Capacitor"
STATUS: Sci-Fi Movie Reference.
THREAT: High levels of nonsense.
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Panic: "Oh no! Go fix it!"',
                            next: 'node_5_usb',
                            points: 0
                        },
                        {
                            text: 'Deny: "Sir, that is not a real thing. Leave now."',
                            next: 'node_5_usb',
                            points: 200
                        }
                    ]
                },

                // STAGE 5: THE USB
                node_5_usb: {
                    id: 'node_5_usb',
                    text: 'He is leaving, defeated. But he "accidentally" drops a USB drive on the floor labeled "EXECUTIVE_SALARIES_2024". He walks out the door.',
                    data: [
                        {
                            label: 'Scanner',
                            type: 'alert',
                            content: `
OBJECT: Dropped USB Drive.
LABEL: "EXECUTIVE_SALARIES" (Bait).
TACTIC: Curiosity.
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Plug it in: "I have to know what they make!"',
                            next: 'node_finish',
                            points: 0
                        },
                        {
                            text: 'Secure it: Do not plug it in. Hand it to the Security Lead.',
                            next: 'node_finish',
                            points: 200
                        }
                    ]
                },

                // ENDING
                node_finish: {
                    type: 'ending',
                    text: 'EXAM COMPLETE. Submitting report to Human Resources...',
                    outcome: 'calculated', // Triggers score-based success logic
                    stars: 3
                }
            }
        }
    }
};

export default ExamFriendlyStranger;
