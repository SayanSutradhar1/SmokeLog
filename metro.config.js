const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add 'mjs' to support lucide-react-native resolution
config.resolver.sourceExts.push("mjs");

module.exports = config;
