export const CERTIFICATE_TYPES = {
    PHASE: 'phase',
    SCENARIO: 'scenario',
    SPECIAL: 'special'
};

export const CERTIFICATES = [
    {
        id: 'cyber_awareness_fundamentals',
        title: 'Cyber Awareness Fundamentals',
        description: 'Awarded for successfully completing the comprehensive Cyber Awareness Fundamentals training program, demonstrating proficiency in Policy, Social Engineering defense, and Incident Response.',
        type: CERTIFICATE_TYPES.SPECIAL,
        requirements: {
            phases: ['phase1', 'phase2', 'phase3'],
            minScore: 0
        },
        iconName: 'FaGraduationCap',
        status: 'available',
        issuer: 'CyberGuard Academy',
        signature: 'Director of Training'
    }
];
