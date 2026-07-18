const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/**
 * Metro is told about one folder outside `mobile/`: the campfire library at
 * `../src/lib/campfire`. That folder is deliberately framework-free plain
 * TypeScript, so the app and the website run the exact same daily-question
 * clock, queries, and answer-gate rule instead of two copies that drift.
 *
 * Import it as `@campfire` from anywhere in the app.
 */

const projectRoot = __dirname;
const repoRoot = path.resolve(projectRoot, "..");
const campfireLib = path.resolve(repoRoot, "src/lib/campfire");

const config = getDefaultConfig(projectRoot);

// Metro only watches the project root by default; without this the shared
// library is invisible to the bundler.
config.watchFolders = [campfireLib];

// Look in mobile/node_modules first, so the web app's copies one level up
// never win a lookup.
//
// Hierarchical lookup stays ON deliberately: many Expo packages (expo-asset,
// for one) are installed nested under expo/node_modules, and disabling it
// makes those unresolvable.
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "@campfire": campfireLib,
};

module.exports = config;
