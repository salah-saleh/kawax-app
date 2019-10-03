const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const GlobSassImporter = require('node-sass-glob-importer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EncodingPlugin = require('webpack-encoding-plugin');

/* #################################################################################################
##                                            Env                                                 ##
## ############################################################################################## */

const __ENV__ = process.env.NODE_ENV;
const __DEV__ = (__ENV__ === 'development');
const __STAGING__ = (__ENV__ === 'staging');
const __PRODUCTION__ = (__ENV__ === 'production');

const __BUILD_ENV__ = process.env.BUILD_ENV;
const __MINIFY_BUILD__ = process.env.MINIFY_BUILD;
const ___WEBPACK_ANALYZE__ = process.env.WEBPACK_ANALYZE;
const __HOST_SERVER__ = 'localhost';

/* #################################################################################################
##                                        Webback main                                            ##
## ############################################################################################## */

const __webpack_entry = './src/index.js';

const __webpack_mode = __PRODUCTION__ ? 'production' : 'development';

/* #################################################################################################
##                                        Built output                                            ##
## ############################################################################################## */

const __webpack_output = {
  publicPath: '/assets/',
  filename: 'index.js',
  path: path.resolve(__dirname, 'dist/js'),
  globalObject: 'this',
  chunkFilename: __DEV__ ? '[name].js' : '[chunkHash].js',
};

/* #################################################################################################
##                                     Performance settings                                       ##
## ############################################################################################## */

const __webpack_performance = {
  hints: false,
};

/* #################################################################################################
##                                    Client DotEnv (config)                                      ##
## ############################################################################################## */

function getDotEnvConf() {
  const config = path.resolve(__dirname, 'config', 'env');
  switch (process.env.BUILD_ENV) {
    case 'staging': {
      return `${config}/staging.env`;
    }
    case 'production': {
      return `${config}/production.env`;
    }
    default: {
      return `${config}/development.env`;
    }
  }
}

/* #################################################################################################
##                                      Webpack Plugings                                          ##
## ############################################################################################## */

let __webpack_plugins = [
/* ------------------------ ##
##       CleanWebpack       ##
## ------------------------ */
  new CleanWebpackPlugin(['./dist/js']),

/* ------------------------ ##
##           __DEV__        ##
## ------------------------ */
  new webpack.DefinePlugin({
    __PRODUCTION__: __PRODUCTION__,
    __STAGING__: __STAGING__,
    __DEV__: __DEV__,
  }),

/* ------------------------ ##
##         Encoding         ##
## ------------------------ */
  new EncodingPlugin({
    encoding: 'utf8'
  }),

/* ------------------------ ##
##          Dovenv          ##
## ------------------------ */
  new DotenvPlugin({
    path: getDotEnvConf(),
    systemvars: true, // allow overriding env files with system env variables
  }),
];

/* ------------------------ ##
##           UglifyJs       ##
## ------------------------ */
if (!__DEV__ || __MINIFY_BUILD__) {
  __webpack_plugins.push(new UglifyJsPlugin({
    parallel: true,
  }));
}

/* ------------------------ ##
##       BundleAnalyzer     ##
## ------------------------ */
if (__DEV__ && ___WEBPACK_ANALYZE__) {
  __webpack_plugins.push(new BundleAnalyzerPlugin());
}

/* #################################################################################################
##                                          aliases                                               ##
## ############################################################################################## */

const __webpack_aliases = {
  alias: {
    'scss': path.join(__dirname, 'scss'),
  }
};

/* #################################################################################################
##                                         Node mock                                              ##
## ############################################################################################## */

const __webpack_node = {
  net: 'empty',
  fs: 'empty',
  tls: 'empty',
}

/* #################################################################################################
##                                      Module and rules                                          ##
## ############################################################################################## */

const __webpack_module = {
  rules: [
    {
      test: /\.brfs\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'transform-loader?brfs',
        }
      ],
    },
    {
      loader: 'babel-loader',
      test: /\.js$/,
      exclude: /(node_modules)/,
      options: {
        sourceMap: true,
      }
    },
    {
      loader: 'worker-loader',
      test: /\.worker\.js$/,
      exclude: /(node_modules)/,
      options: {
        publicPath: '/assets/',
        name: '[name].js',
      },
    },
    {
      test: /\.css$/,
      use: [
        'style-loader' ,
        {
          loader: 'css-loader',
          options: {
            sourceMap: __DEV__,
          },
        },
      ]
    },
    {
      test: /\.scss$/,
      use: [
        'style-loader' ,
        {
          loader: 'css-loader',
          options: {
            sourceMap: __DEV__,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            importer: GlobSassImporter(),
            sourceMap: __DEV__,
          },
        }
      ]
    }
  ],
};

/* #################################################################################################
##                                          Dev Server                                            ##
## ############################################################################################## */

const __webpack_dev_server = {
  host: __HOST_SERVER__,
  publicPath: '/assets',
  contentBase: path.join(__dirname, 'public'),
  watchContentBase: true,
  historyApiFallback: true,
  compress: false,
  port: 8080,
  hot: true,
  disableHostCheck: true,
  open: false,
}

const __webpack_watch_options = {
  ignored: /node_modules/,
  aggregateTimeout: 1000,
}

/* #################################################################################################
##                                             Export                                             ##
## ############################################################################################## */

module.exports = {
  entry: __webpack_entry,
  mode: __webpack_mode,
  output: __webpack_output,
  performance: __webpack_performance,
  module: __webpack_module,
  node: __webpack_node,
  plugins: __webpack_plugins,
  resolve: __webpack_aliases,
  devServer: __webpack_dev_server,
  watchOptions: __webpack_watch_options,
};
