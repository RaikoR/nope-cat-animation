const WatcherWebpackPlugin = require('extra-watch-webpack-plugin');

module.exports = (env) => {
  const defaultConfig = new WatcherWebpackPlugin({
    files: ['app/assets/svg/*.svg']
  });

  const plugin = {
    development: defaultConfig
  };

  return plugin[env];
};
