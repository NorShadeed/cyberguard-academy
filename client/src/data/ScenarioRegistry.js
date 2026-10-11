/**
 * SCENARIO REGISTRY (Auto-Discovery)
 * 
 * This file automatically loads all valid .js scenario files from the ./scenarios directory.
 * No manual registration is required. Just add a file, and it appears.
 */

// Helper to normalize data that might be missing or inconsistent
const normalizeScenario = (data) => {
    // Ensure vital stats are present
    return {
        ...data,
        // Fallback defaults
        difficulty: data.difficulty || 'Unknown',
        duration: data.duration || data.time || '15 min',
        xpReward: data.xpReward || data.xp || 0
    };
};

// --- AUTO-DISCOVERY LOGIC ---
const loadScenarios = () => {
    const registry = {};

    // Webpack 'require.context' to find all .js files in ./scenarios
    // Arguments: directory, useSubdirectories, regExp
    const context = require.context('./scenarios', false, /\.js$/);

    context.keys().forEach((fileName) => {
        try {
            // Import the file
            const module = context(fileName);
            const scenario = module.default;

            // Validation: Must have an ID and Title
            if (scenario && scenario.id) {
                // Normalize and Register
                registry[scenario.id] = normalizeScenario(scenario);
            } else {
                console.warn(`[ScenarioRegistry] File ${fileName} skipped: Missing 'id' or default export.`);
            }
        } catch (err) {
            console.error(`[ScenarioRegistry] Failed to load scenario from ${fileName}:`, err);
        }
    });

    return registry;
};

// Populate Registry Once
export const SCENARIO_REGISTRY = loadScenarios();

// Legacy ID Mapping (Aliases) - Optional, keep if needed for old hardcoded refs
const SCENARIO_ALIASES = {
    'zero-day-meltdown': 'sc_zero_day'
};

export const getScenarioById = (id) => {
    // Check main registry
    if (SCENARIO_REGISTRY[id]) {
        return SCENARIO_REGISTRY[id];
    }
    // Check aliases
    if (SCENARIO_ALIASES[id]) {
        return SCENARIO_REGISTRY[SCENARIO_ALIASES[id]];
    }
    return null;
};

export const getAllScenarios = () => {
    return Object.values(SCENARIO_REGISTRY);
};
