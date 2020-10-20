const HtmlwebpackSvgPlugin = require('html-webpack-inline-svg-plugin');

module.exports = (env) => {
  const defaultConfig = new HtmlwebpackSvgPlugin({
    runPreEmit: true,
    inlineAll: true
  });

  const plugin = {
    production: defaultConfig,
    development: defaultConfig
  };

  return plugin[env];
};
