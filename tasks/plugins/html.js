const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    const defaultConfig = new HtmlWebpackPlugin({
        filename: 'index.html',
        hash: true,
        template: './app/index.html.ejs',
        templateParameters: {
            nodeEnv: env.NODE_ENV,
        },
    });

    const plugin = {
        development: defaultConfig,
        production: defaultConfig,
    };

    return plugin[env];
};
