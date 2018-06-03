const UserService = require('./service/user-service')
const userController = require('./controller/uc-controller')

module.exports = {
  name: 'user',

  created (app) {
    app.context.services.user = new UserService()
  },

  ready (app) {
    app.context.services.user.init(app.context.services.mongodb)
    const router = app.context.router
    router.post('/open/user/register', userController.register)
    router.post('/open/user/login', userController.login)
  }

}
