const HtmlwebpackSvgPlugin = require('html-webpack-inline-svg-plugin');

module.exports = (env) => {
    const defaultConfig = new HtmlwebpackSvgPlugin({
        inlineAll: true,
        runPreEmit: true,
        svgoConfig: [
            {
                collapseGroups: false,
            },
            {
                convertShapeToPath: false,
            },
            {
                mergePaths: false,
            },
            {
                convertPathData: false,
            },
        ],
    });

    const plugin = {
        development: defaultConfig,
        production: defaultConfig,
    };

    return plugin[env];
};
