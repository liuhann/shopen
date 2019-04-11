const MobileUserController = require('./UserController')
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
        const token = ctx.query.token
        if (token == null) {
          ctx.userid = ''
          await next()
          return
        } else if (app.tokenUsers[token] == null /* 未查询过token */) {
          const tokenUser = await controller.userdao.getOne({
            token
          })
          if (tokenUser == null) {
            app.tokenUsers[token] = ''
          } else {
            app.tokenUsers[token] = tokenUser.id
          }
        }
        ctx.userid = app.tokenUsers[token]
        await next()
      })
  },

  ready (app) {
    const router = app.context.router
    app.context.userController.initRoutes(router)
  }
}
