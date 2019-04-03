const bodyParser = require('koa-body')
const cors = require('kcors')
const Router = require('koa-router')
const HttpError = require('http-errors')
const serve = require('koa-static')
const send = require('koa-send')
const httplog = require('debug')('http')
const { resolve } = require('path')

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
    app.use(async (ctx, next) => {
      httplog(`${ctx.path} ${ctx.querystring}`)
      await next()
    })

    app.use(cors({
      credentials: true
    }))
    app.use(bodyParser({
      multipart: true
    }))
    app.context.router = new Router()
    app.context.services.validator = validator

    app.use(serve('public', {
      maxage: 30 * 24 * 60 * 60 * 1000
    }))
  },

  ready (app) {

  },

  bootComplete (app) {
    app
      .use(app.context.router.routes())
      .use(app.context.router.allowedMethods())
    app.use(async (ctx, next) => {
      if (ctx.status === 404) {
        await send(ctx, '/index.html', {
          root: resolve('public')
        })
      }
      await next()
    })
  }
}
