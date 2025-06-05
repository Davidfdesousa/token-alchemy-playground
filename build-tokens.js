
const StyleDictionary = require('style-dictionary');

// Load the configuration
const sd = StyleDictionary.extend(require('./style-dictionary.config.js'));

// Build the tokens
sd.buildAllPlatforms();

console.log('✅ Design tokens built successfully!');
