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
      multipart: true,
      formidable: {
        uploadDir: app.config.image_storage,
        maxFileSize: 50 * 1024 * 1024 // 设置上传文件大小最大限制，默认50M
      }
    }))
    app.context.router = new Router()

    app.use(serve('public', {
      maxage: 30 * 24 * 60 * 60 * 1000
    }))
    app.middlewares = {}
  },

  ready (app) {

  },

  bootComplete (app) {
    const apiRouter = new Router()
    apiRouter.use('/api', app.context.router.routes(), app.context.router.allowedMethods())
    app.use(apiRouter.routes())
    app.use(async (ctx, next) => {
      if (ctx.status === 404) {
        if (ctx.path.indexOf('/api') === 0) {
          // api request is 404
          ctx.body = {
            code: 404,
            msg: 'no such api'
          }
        } else {
          // other return home page
          await send(ctx, '/index.html', {
            root: resolve('public')
          })
        }
      }
      await next()
    })
  }
}
