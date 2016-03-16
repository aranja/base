/**
 * Aranja base
 */

import 'babel-polyfill'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'
import merge from 'lodash/merge'
import webpack from 'webpack'

const DEBUG = !process.argv.includes('--release')
const VERBOSE = process.argv.includes('--verbose')
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
]
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
}


//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {
  output: {
    publicPath: '/',
    sourcePrefix: '  ',
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'app'),
        ],
        loader: 'babel-loader',
      }, {
        test: /\.scss$/,
        loaders: [
          `css-loader?${DEBUG ? 'sourceMap&' : 'minimize&'}modules&localIdentName=` +
          `${DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]'}`,
          'postcss-loader?parser=postcss-scss',
        ],
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
      },
    ],
  },

  postcss: function plugins(bundler) {
    return [
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ]
  },

  resolve: {
    alias: {
      app: path.join(__dirname, 'app'),
    },
  },
}


//
// Configuration for the client-side bundle
// -----------------------------------------------------------------------------

const clientConfig = merge({}, config, {
  entry: !DEBUG ? './app/client.js' : [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    './app/client.js',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: DEBUG ? '[name].js?[hash]' : '[name].[hash].js',
  },

  devServer: {
    // This should be set to false, but the option isn't passed through correctly
    // https://github.com/webpack/webpack-dev-server/pull/423
    contentBase: 'not-a-folder/',
    historyApiFallback: true,
  },

  // Choose a developer tool to enhance debugging
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  plugins: [
    ...config.plugins,
    new webpack.DefinePlugin({ ...GLOBALS, 'process.env.BROWSER': true }),
    new HtmlWebpackPlugin(),
    ...(!DEBUG ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
          screw_ie8: true,

          // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
          warnings: VERBOSE,
        },
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
      new ExtractTextPlugin('[name].[chunkhash].css'),
    ] : []),
  ],
})

export default clientConfig
