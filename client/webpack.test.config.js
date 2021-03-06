/**
 * Creates a test bundle in dist that will be fed to mocha.
 */
var webpack = require('webpack'),
    path = require('path');

module.exports = {
    devtool: 'eval',
    entry: [
        // entrypoint to resolve dependencies
        './lib/application/test/bootstrap',
        './lib/resource/test/bootstrap',
        './lib/common/test/bootstrap'
    ],
    target: 'node',
    node: {
        __dirname: true     // fix for superagent
    },
    output: {
        path: __dirname + '/dist/',
        filename: 'test.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/^underscore$/, 'common/src/lodash.custom'),
        new webpack.NormalModuleReplacementPlugin(/^lodash$/, 'common/src/lodash.custom'),
        new webpack.DefinePlugin({
            'ENV_DEVELOPMENT': false,
            'ENV_TEST': true,
            'global.GENTLY': false  // fix for superagent
        })
    ],
    resolve: {
        extensions: ['', '.js', '.less'],
        alias: {
            common: path.resolve(__dirname, './lib/common/'),
            yourturn: path.resolve(__dirname, './lib/yourturn/'),
            application: path.resolve(__dirname, './lib/application/'),
            resource: path.resolve(__dirname, './lib/resource/')
        }
    },
    externals: {
        OAUTH_CLIENT_ID: 'YTENV_OAUTH_CLIENT_ID',
        OAUTH_AUTH_URL: 'YTENV_OAUTH_AUTH_URL',
        OAUTH_REDIRECT_URI: 'YTENV_OAUTH_REDIRECT_URI',
        OAUTH_SCOPES: 'YTENV_OAUTH_SCOPES',
        KIO_BASE_URL: 'YTENV_KIO_BASE_URL',
        TWINTIP_BASE_URL: 'YTENV_TWINTIP_BASE_URL',
        MINT_BASE_URL: 'YTENV_MINT_BASE_URL',
        ESSENTIALS_BASE_URL: 'YTENV_ESSENTIALS_BASE_URL',
        TEAM_BASE_URL: 'YTENV_TEAM_BASE_URL',
        PIERONE_BASE_URL: 'YTENV_PIERONE_BASE_URL',
        DOCKER_REGISTRY: 'YTENV_DOCKER_REGISTRY',
        SERVICE_URL_TLD: 'YTENV_SERVICE_URL_TLD',
        RESOURCE_WHITELIST: 'YTENV_RESOURCE_WHITELIST'
    },
    eslint: {
        configFile: './.eslintrc'
    },
    module: {
        preLoaders: [
            { test: /\.js$/, exclude: /(node_modules|lodash)/, loader: 'eslint' }
        ],
        loaders: [
            { test: /\.hbs$/, exclude: /node_modules/, loader: 'handlebars?helperDirs[]=' + __dirname + '/lib/common/src/handlebars' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.less$/, exclude: /node_modules/, loader: 'null' },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'null' },
            { test: /\.json$/, loader: 'json' },,
            { test: /\.(png|jpg|jpeg|gif)$/, loader: 'null'}
        ]
    }
};
