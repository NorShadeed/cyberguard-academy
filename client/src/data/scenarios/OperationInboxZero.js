const OperationInboxZero = {
    id: 'sc_phishing_exam',
    title: 'Exam: Operation Inbox Zero',
    thumbnail: '/images/operation_inbox_zero.png', // FIXED: ScenarioDetail uses 'thumbnail'
    description: 'LIVE FIRE EXERCISE: You have full control of the quarantine queue for TitanCorp\'s C-Suite. Sophisticated actors are targeting the CFO. One mistake grants them entry. Verify every header, check every log.',
    tagline: 'Trust No One. Verify Everything.',
    xp: 1000,
    time: '15 Mins',
    learningObjectives: [
        'Email Header Analysis (SPF/DKIM/DMARC)',
        'Identifying Malicious Payload Extensions',
        'Recognizing Social Engineering Indicators'
    ],
    difficulty: 'Intermediate',
    type: 'exam', // Signals "Exam Mode" (Auto-start, no roles)
    totalSteps: 5,
    roles: {
        'analyst': {
            id: 'analyst',
            title: 'Security Operator',
            description: 'The last line of defense.',
            startNode: 'email_1',
            nodes: {

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
                        { text: "Revoke Access (Click Link)", next: 'email_2', points: 0 },
                        { text: "Blacklist Domain", next: 'email_2', points: 200, judge: "GOOD KILL. Domain age (1 hour) + Typosquatting = 100% Malicious. DMARC passed only because they own the fake domain." }
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
                        { text: "Process Payment", next: 'email_3', points: 0 },
                        { text: "Flag as Impersonation", next: 'email_3', points: 200, judge: "CORRECT. The 'Reply-To' address was external (gmail.com), hiding behind the display name. Good eye." }
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
                        { text: "Allow - Vendor is Trusted", next: 'email_4', points: 0 },
                        { text: "Block & Detonate in Sandbox", next: 'email_4', points: 200, judge: "EXCELLENT WORK. 'Double extension' attacks hide the .exe. High entropy suggested a packed payload. This was Zero-Day Ransomware." }
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
                        { text: "Ignore - It's Phishing", next: 'email_5', points: 0 },
                        { text: "Acknowledge Alert", next: 'email_5', points: 200, judge: "CORRECT. The sender domain '.local' and the correlated server logs confirm this is a legitimate system notification." }
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
                        { text: "Open Document", next: 'success', points: 0 },
                        { text: "Block External Share", next: 'success', points: 200, judge: "SECURE. Legitimate platform (Google Docs) + Unknown External Sender = High Risk. They were abusing Google's reputation." }
                    ]
                },
                'success': {
                    id: 'success',
                    text: "QUARANTINE QUEUE PROCESSED.\n\nYou have completed the assessment. The system has analyzed your performance across all 5 categories.",
                    type: 'ending',
                    // Score is not hardcoded here anymore, it's cumulative from choices
                    outcome: 'calculated'
                }
            }
        }
    }
};

export default OperationInboxZero;
