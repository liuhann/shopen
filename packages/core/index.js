const bodyParser = require('koa-body')
const cors = require('kcors')
const Router = require('koa-router')
const HttpError = require('http-errors')

const validator = require('async-validator')
validator.prototype.validated = async function (object) {
  return new Promise((resolve, reject) => {
    this.validate(object, function (errors, fields) {
      if (errors) {
        reject(HttpError(400, 'validate errors', errors))
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  name: 'core',

  created (app) {
    app.use(cors({
      credentials: true
    }))
    app.use(bodyParser())
    app.context.router = new Router()
    app.context.services.validator = validator
  },

  ready (app) {

  },

  bootComplete (app) {
    app
      .use(app.context.router.routes())
      .use(app.context.router.allowedMethods())
  }
}
