const path = require('path');
const merge = require('webpack-merge');

const devConfig = require('../../../../scripts/webpack/webpack.config.dev');
const themeConfig = require('./webpack.config.theme');

const config = merge(devConfig, themeConfig, {
  entry: {
    index: path.resolve(__dirname, '../../src/index')
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../../public')
  }
});

module.exports = config;
