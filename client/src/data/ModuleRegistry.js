/**
 * MODULE REGISTRY (Auto-Discovery)
 * 
 * This file automatically loads all valid .js module files from the ./modules directory.
 * No manual registration is required. Just add a file, and it appears.
 */

// --- AUTO-DISCOVERY LOGIC ---
const loadModules = () => {
    const modules = [];

    // Webpack 'require.context' to find all .js files in ./modules
    const context = require.context('./modules', false, /\.js$/);

    context.keys().forEach((fileName) => {
        try {
            // Import the file
            const moduleExport = context(fileName);
            const moduleData = moduleExport.default;

            // Validation: Must have an ID and Phases
            if (moduleData && moduleData.id && Array.isArray(moduleData.phases)) {
                modules.push(moduleData);
            } else {
                console.warn(`[ModuleRegistry] File ${fileName} skipped: Missing 'id', 'phases', or default export.`);
            }
        } catch (err) {
            console.error(`[ModuleRegistry] Failed to load module from ${fileName}:`, err);
        }
    });

    return modules;
};

// Populate Registry Once
export const MODULE_REGISTRY = loadModules();

export const getAllModules = () => {
    return MODULE_REGISTRY;
};

export const getModuleById = (id) => {
    return MODULE_REGISTRY.find(m => m.id === id);
};
