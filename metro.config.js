const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ignorar a pasta pixel-agents (extensão VS Code — projeto separado, não faz parte do app)
config.watchFolders = [];
config.resolver.blockList = [
  /.*\/pixel-agents\/.*/,
];

module.exports = config;
