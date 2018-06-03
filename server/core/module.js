const MongodbService = require('./mongo/mongodb')

const bodyParser = require('koa-body');
const parser = require('koa-bodyparser')
const cors = require('kcors')
const serve = require('koa-static')
const validate = require('./validate/middleware')
const Schema = require('./validate/extend')
const daoErrorHandler = require('./mongo/middleware')

module.exports = {
  name: 'core',

  created(app) {
    app.use(cors({
      credentials: true
    }))

    app.use(bodyParser())

  },

  ready(server) {

  },

  onload (app) {

    app.use(serve('./static'))
    
    app.use(parser())

    app.use(bodyParser());

    app.use(validate)

    app.use(daoErrorHandler)

    app.context.Schema = Schema
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
  },

  onLoaded() {

  }
}
