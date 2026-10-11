import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import DigitalLifeSecurity from './modules/DigitalLifeSecurity';
import SocialEngineeringOps from './modules/SocialEngineeringOps';

// Helper to extract phases into a map
const extractPhases = (courseModule) => {
    const map = {};
    if (courseModule && courseModule.phases) {
        courseModule.phases.forEach(phase => {
            map[phase.phaseId] = phase;
        });
    }
    return map;
};

export const TEACHING_MODULES = {
    // --- Legacy / Default ---
    'p1_phishing_detect': {
        professor: {
            name: "Dr. Sarah Conner",
            title: "Senior Threat Analyst",
            avatarIcon: <FaShieldAlt />
        },
        lessons: [
            {
                id: 1,
                title: "Introduction to Phishing",
                content: <p>Phishing is a type of social engineering where an attacker sends a fraudulent message designed to trick a human victim into revealing sensitive information.</p>
            },
            {
                id: 2,
                title: "Identifying Suspicious Links",
                content: <p>Always hover over links to see the actual URL. Watch out for misspellings like 'g00gle.com'.</p>
            }
        ]
    },

    // --- Digital Life Security ---
    ...extractPhases(DigitalLifeSecurity),

    // --- Social Engineering Ops ---
    ...extractPhases(SocialEngineeringOps)
};
