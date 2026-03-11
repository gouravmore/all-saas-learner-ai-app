// Webpack configuration override for Create React App
// This allows us to import TypeScript files from the library directory
const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    // Ensure TypeScript files are resolved
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.extensions) {
      config.resolve.extensions = [];
    }
    // Add .ts and .tsx if not already present (before .js for priority)
    const extensions = config.resolve.extensions;
    if (!extensions.includes('.ts')) {
      extensions.unshift('.ts');
    }
    if (!extensions.includes('.tsx')) {
      extensions.unshift('.tsx');
    }
    return config;
  }
);

