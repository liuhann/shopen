const UserService = require('./service/user-service')
const userController = require('./controller/uc-controller')

module.exports = {
  name: 'user',
  disabled: true,

  created (app) {
    app.context.services.user = new UserService()
    app.use(ctx => {
      ctx.user = 'test'
    })
  },

  ready (app) {
    app.context.services.user.init(app.context.services.mongodb)
    const router = app.context.router
    router.post('/open/user/register', userController.register)
    router.post('/open/user/login', userController.login)
  }
}
