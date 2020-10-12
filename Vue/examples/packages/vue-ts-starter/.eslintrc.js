const path = require('path');
const baseConfig = require('../../.eslintrc.js');

module.exports = {
  ...baseConfig,
  settings: {
    'import/resolver': {
      webpack: { config: path.resolve(__dirname, './scripts/webpack/webpack.config.resolve.js') }
    }
  }
};
