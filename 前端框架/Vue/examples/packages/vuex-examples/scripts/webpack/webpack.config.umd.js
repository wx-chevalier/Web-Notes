const merge = require('webpack-merge');

const themeConfig = require('./webpack.config.theme');
const umdConfig = require('../../../../scripts/webpack/webpack.config.umd');

module.exports = merge(umdConfig, themeConfig, {
  entry: {
    index: path.resolve(__dirname, '../../src/index.umd')
  }
});
