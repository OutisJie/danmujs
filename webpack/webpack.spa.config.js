/* eslint-disable */
// Webpack config for development
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const assetsPath = path.resolve(__dirname, '../static/dist');
const os = require('os');
const interfaces = os.networkInterfaces();
const hostIp = function() {
    var IPv4;
    if(process.platform === 'darwin') {
        for(var i = 0; i < interfaces.en0.length; i++) {
            if(interfaces.en0[i].family == 'IPv4') {
                IPv4 = interfaces.en0[i].address;
            }
        }
    } else if(process.platform === 'win32') {
        for(var devName in interfaces) {
            var iface = interfaces[devName];
            for(var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    IPv4 = alias.address;
                }
            }
        }
    }
    return IPv4;
}
const host = (process.env.HOST || hostIp());
const port = (+process.env.PORT + 1) || 3001;

var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin')

const babelrc = fs.readFileSync('./src/client/.babelrc');
let babelrcObject = {};

const AntTheme = require(path.resolve(__dirname, '../package.json'))['ant-theme'];

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}


const babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
let combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

const babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, { plugins: combinedPlugins });
delete babelLoaderQuery.env;

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?path=http://' + host + ':' + port + "/__webpack_hmr",
      './src/client/entry.js',
    ],
  },
  output: {
    path: assetsPath,
    filename: 'main.js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/',
    library: 'hawkeye',
    libraryTarget: 'umd',
    jsonpFunction: 'webpackJsonp_hawkeye',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        include: [
          path.resolve(__dirname, `../node_modules/antd/`),
        ],
        use: [
          {
            loader: "@dwd/webpack-replace-x",
            options: {
              params: {
                "ant-": "hawk-",
              },
              filter: ['@ant-design']
            }
          }
        ]
      },
      { test: /\.jsx?$/, exclude: /node_modules/, use: 'happypack/loader?id=js' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'happypack/loader?id=css'})},
      {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract({fallback: 'style-loader',
          use: 'happypack/loader?id=less'})
      },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'happypack/loader?id=scss' }) },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      { test: /\.(png|jpg|gif)$/i, loader: 'url-loader?limit=10000'},
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, '../node_modules')],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      container: path.resolve(__dirname, '..') + '/src/common/container',
      components: path.resolve(__dirname, '..') + '/src/common/components',
      apis: path.resolve(__dirname, '..') + '/src/common/apis',
      actions: path.resolve(__dirname, '..') + '/src/common/actions',
      reducers: path.resolve(__dirname, '..') + '/src/common/reducers',
      utils: path.resolve(__dirname, '..') + '/src/common/utils',
      constants: path.resolve(__dirname, '..') + '/src/common/constants',
      images: path.resolve(__dirname, '..') + '/src/common/images',
      enum: path.resolve(__dirname, '..') + '/src/server/dubbo/enum',
    },
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      IS_CLIENT: true,
      IS_SERVER: false,
      IS_DEVELOPMENT: true,
      ENABLE_DEVTOOLS: true,  // <-------- DISABLE redux-devtools HERE
    }),
    // css files from the extract-text-plugin loader
    new ExtractTextPlugin({filename: '[name].css', allChunks: true}),
    new HappyPack({
      id: 'js',
      threads: 4,
      loaders: ['babel-loader?' + JSON.stringify(babelLoaderQuery)],
    }),
    new HappyPack({
      id: 'scss',
      threads: 1,
      loaders: [ 'css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]', 'postcss-loader', 'fast-sass-loader']
    }),
    new HappyPack({
      id: 'less',
      threads: 2,
      loaders: [
        'css-loader?importLoaders=2&sourceMap',
        'postcss-loader',
        {
          loader: 'less-loader',
          options: {
            outputStyle: 'expanded',
            sourceMap: true,
            modifyVars: AntTheme,
          }
        },
      ]
    }),
    new HappyPack({
      id: 'css',
      threads: 1,
      loaders: ['css-loader', 'postcss-loader']
    }),
    new ProgressBarPlugin(),
    new AssetsPlugin(),
  ],
};
/* eslint-enable */
