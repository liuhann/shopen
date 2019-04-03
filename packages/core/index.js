const bodyParser = require('koa-body')
const cors = require('kcors')
const Router = require('koa-router')
const serve = require('koa-static')
const send = require('koa-send')
const httplog = require('debug')('http')
const { resolve } = require('path')

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
