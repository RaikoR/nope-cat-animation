const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  const defaultConfig = new HtmlWebpackPlugin({
    hash: true,
    filename: 'index.html',
    template: './app/index.html.ejs'
  });

  const plugin = {
    production: defaultConfig,
    development: defaultConfig
  };

  return plugin[env];
};
