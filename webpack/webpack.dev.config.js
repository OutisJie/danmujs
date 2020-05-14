const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, '../src/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('../manifest.json'),
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, '../src'),
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, '../tsconfig.json'),
            getCustomTransformers: () => ({
              before: [tsImportPluginFactory({
                libraryName: 'antd',
                libraryDirectory: 'lib',
                style: true
              })]
            })
          }
        }]
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader',
            options: {
              env: 'development',
              logLevel: 2,
              functions: {
                getHeight: function() { return less.Dimension(1) },
                getWidth: function() { return less.Dimension(2) },
                test: function() { console.log('less test') }
              },
              modifyVars: {
                "primary-color": "#0083ff",
                "font-size-base": "14px",
                "border-radius-base": "2px",
                "btn-shadow": "none",
                "btn-primary-shadow": "none",
                "btn-text-shadow": "none",
              },
              javascriptEnabled: true
            }
          }
        ]
      },
      { test: /\.(jpe?g|png|gif)$/i, loader: 'url-loader?limit=10240' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10240&mimetype=image/svg+xml' },
      { test: /\.(mp4|mp3|mav)$/, loader: 'file-loader' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      pages: path.resolve(__dirname, '../src/pages'),
      components: path.resolve(__dirname, '..src/components'),
      api: path.resolve(__dirname, '../src/api'),
      utils: path.resolve(__dirname, '../src/utils'),
      my_module: path.resolve(__dirname, '../src/my_module'),
      'react-dom': '@hot-loader/react-dom'
      // 理论上加了这个之后可以支持 hooks reloading。但是ts 项目必须要用babel plugin,本项目用 ts 不用 babel。
      // 综上，本项目不支持 hooks reloading,完全依赖 webpack HMR。
    }
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '../dist/',
    host: '127.0.0.1',
    port: '3000',
    headers: { // 在所有响应中添加首部内容
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true, // 所有404请求自动替换成 index.html
    hotOnly: true, // 不需要刷新的模块热替换，需要 HotModuleReplacementPlugin插件
    proxy: {
      '/api': 'http://127.0.0.1:3000'
    }
  }
}