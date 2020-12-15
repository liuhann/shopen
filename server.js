process.env.DEBUG = 'wind:*,oss,restful,danke:*,unsplash'
const BootStrap = require('wind-boot')
const coreHttp = require('wind-core-http')
const aliyun = require('./packages/aliyun')
const danke = require('./packages/danke')
const mongo = require('./packages/mongo')
const user = require('./packages/user')
const config = require('./config')
const unsplash = require('./packages/unsplash')

const bootApp = new BootStrap(Object.assign(config, {
  packages: [coreHttp, mongo, user, aliyun, danke, unsplash]
}))

bootApp.start()
