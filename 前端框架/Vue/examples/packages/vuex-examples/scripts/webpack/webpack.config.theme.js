const ThemeColorReplacer = require('webpack-theme-color-replacer');

module.exports = {
  plugins: [
    new ThemeColorReplacer({
      fileName: 'theme-colors-[contenthash:8].css',
      matchColors: getAntdSerials('#5d4bff'), // 主色系列
      // 改变样式选择器，解决样式覆盖问题
      changeSelector(selector) {
        switch (selector) {
          case '.ant-calendar-today .ant-calendar-date':
            return ':not(.ant-calendar-selected-date)' + selector;
          case '.ant-btn:focus,.ant-btn:hover':
            return '.ant-btn:focus:not(.ant-btn-primary),.ant-btn:hover:not(.ant-btn-primary)';
          case '.ant-btn.active,.ant-btn:active':
            return '.ant-btn.active:not(.ant-btn-primary),.ant-btn:active:not(.ant-btn-primary)';
          default:
            return selector;
        }
      }
    })
  ]
};

/** 获取系列颜色 */
function getAntdSerials(color) {
  var lightens = new Array(9).fill().map((t, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / 10);
  });
  // 此处为了简化，采用了darken。实际按color.less需求可以引入tinycolor, colorPalette变换得到颜色值
  var darkens = new Array(6).fill().map((t, i) => {
    return ThemeColorReplacer.varyColor.darken(color, i / 10);
  });
  return lightens.concat(darkens);
}
