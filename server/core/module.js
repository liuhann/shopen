const MongodbService = require('./mongo/mongodb')

const parser = require('koa-bodyparser')
const cors = require('kcors')
const serve = require('koa-static')
const validate = require('./validate/middleware')
const Schema = require('./validate/extend')
const daoErrorHandler = require('./mongo/middleware')
const multer = require('koa-multer')

module.exports = {
  name: 'core',

  onload (app) {
    app.use(cors({
      credentials: true
    }))
    app.use(serve('./static'))
    
    app.use(parser())

    app.use(validate)

    app.use(daoErrorHandler)

    app.context.Schema = Schema


    const upload = multer({ dest: 'uploads/' })

    app.use()
  },

  async routes (router) {

  },
  async services ({config}) {
    return {
      mongo: new MongodbService({
        url: 'mongodb://localhost:27017',
        dbName: 'shopen'
      })
    }
  }
}
