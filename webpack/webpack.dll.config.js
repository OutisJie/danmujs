// 将第三方包抽离，如果依赖的库没有更新，就不需要重新对依赖库进行打包
// 打包到node静态下面的dist 仅开发环境 手动引入vendor

const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    vendor: [
      'antd',
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'lodash',
      'moment',
    ]
  },
  output: {
    path: path.resolve(__dirname, '../static/vendor'),
    filename: '[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json',
      name: '[name]',
      context: __dirname
    })
  ]
}