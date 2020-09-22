process.env.DEBUG = 'wind:*,oss'
const BootStrap = require('wind-boot')
const coreHttp = require('wind-core-http')
const aliyun = require('./packages/aliyun')
const danke = require('./packages/danke')
const mongo = require('./packages/mongo')
const user = require('./packages/user')
const config = require('./config')

const bootApp = new BootStrap(Object.assign(config, {
  packages: [coreHttp, mongo, user, aliyun, danke]
}))

bootApp.start()
