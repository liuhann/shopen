const MobileUserController = require('./UserController')
const debug = require('debug')('shopen:user')
module.exports = {
  name: 'user',
  created (app) {
    const controller = new MobileUserController(app.context)
    app.context.userController = controller
    app.tokenUsers = {}
    app.use(
    /**
     * 设置用户信息 如果无token 不设置 有token则查找
     */
      async (ctx, next) => {
        const token = ctx.headers.token || ctx.query.token
        ctx.token = token
        if (token == null || token === '') {
          ctx.user = {}
        } else if (app.tokenUsers[token] == null /* 未查询过token */) {
          debug('load user by token', token)
          const tokenUser = await controller.userdao.getOne({
            token
          })
          if (tokenUser == null) {
            app.tokenUsers[token] = {}
          } else {
            delete tokenUser.pwd
            app.tokenUsers[token] = tokenUser
          }
        }
        ctx.user = app.tokenUsers[token]
        await next()
      })

    app.middlewares.loginRequired = async (ctx, next) => {
      if (!ctx.user || !ctx.user.id) {
        ctx.throw(401)
      } else {
        await next()
      }
    }
  },

  ready (app) {
    const router = app.context.router
    app.context.userController.initRoutes(router)
  }
}
