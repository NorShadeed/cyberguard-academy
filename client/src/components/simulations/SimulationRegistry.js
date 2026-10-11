import ScenarioRunner from './ScenarioRunner';
import Phase1Detective from './password_mastery/Phase1Detective';
import Phase2Defense from './password_mastery/Phase2Defense';
import Phase3Vault from './password_mastery/Phase3Vault';

// Phishing Defense Imports
import IllusionTrustSim from './phishing_defense/IllusionTrustSim';
import BypassShieldSim from './phishing_defense/BypassShieldSim';
import HumanFirewallSim from './phishing_defense/HumanFirewallSim';

// Cyber Awareness Imports (Course 1)
import PhishingDetectiveSim from './cyber_awareness/PhishingDetectiveSim';
import ManipulatorSim from './cyber_awareness/ManipulatorSim';

// Social Engineering Imports
import KillChainSim from './social_engineering/KillChainSim';
import MultiChannelSim from './social_engineering/MultiChannelSim';
import PersuasionSim from './social_engineering/PersuasionSim';

// Digital Life Imports
import PocketFortressSim from './digital_life/PocketFortressSim';
import DigitalNomadSim from './digital_life/DigitalNomadSim';
import InvisibleYouSim from './digital_life/InvisibleYouSim';

const SIMULATION_COMPONENTS = {
    // Password Mastery: Phase 1
    'pm_p1_psychology': Phase1Detective,

    // Password Mastery: Phase 2
    'pm_p2_fortress': Phase2Defense,

    // Password Mastery: Phase 3
    'pm_p3_future': Phase3Vault,

    // Password Mastery: Phase 4 (Exam)
    'pm_p4_exam': ScenarioRunner,
    'sc_password_exam': ScenarioRunner,

    // --- Cyber Awareness ---
    'p1_phishing_detect': PhishingDetectiveSim, // Module 1: Phishing
    'p3_social_eng': ManipulatorSim, // Module 3: Social Engineering

    // --- Phishing Defense ---
    'p1_illusion_trust': IllusionTrustSim,
    'p2_bypass_shield': BypassShieldSim,
    'p3_human_firewall': HumanFirewallSim,

    // --- Social Engineering Ops ---
    'se_p1_playbook': KillChainSim,
    'se_p2_multichannel': MultiChannelSim,
    'se_p3_firewall': PersuasionSim,

    // --- Digital Life Security ---
    'life_p1_mobile': PocketFortressSim,
    'life_p2_nomad': DigitalNomadSim,
    'life_p3_privacy': InvisibleYouSim,
};

export const getSimulationComponent = (phaseId) => {
    return SIMULATION_COMPONENTS[phaseId] || null;
};
