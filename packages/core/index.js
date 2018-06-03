const bodyParser = require('koa-body')
const cors = require('kcors')
const Router = require('koa-router')

module.exports = {
  name: 'core',

  created(app) {
    app.use(cors({
      credentials: true
    }))
    app.use(bodyParser())
    app.context.router = new Router()

  },

  ready(app) {

  },

  bootComplete(app) {
    app
      .use(app.context.router.routes())
      .use(app.context.router.allowedMethods());
  },
}
