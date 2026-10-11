export const COURSE_CATALOG = [
    {
        id: 'c1_social_engineering',
        title: "Social Engineering Fundamentals",
        category: "Phishing",
        image: "/assets/card-bg-1.png",
        targetAudience: "All Employees",
        roi: {
            riskReduction: "45%",
            avgIncidentCost: "$150k",
            timeToValue: "Immediate",
            complianceStandards: ["ISO 27001", "GDPR"]
        },
        phases: [
            {
                phaseId: 'p1_phishing_detect',
                title: "Phishing Detection",
                type: "module",
                xpReward: 500
            },
            {
                phaseId: 'p2_scenario_test',
                title: "Live Simulation",
                type: "scenario",
                scenarioId: 1,
                xpReward: 1000
            }
        ]
    }
];
