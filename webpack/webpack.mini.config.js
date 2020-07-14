const devConf = require('./webpack.dev.config')

devConf.entry.main[devConf.entry.main.length - 1] = './src/client/index.mini.tmp.js'

module.exports = devConf
