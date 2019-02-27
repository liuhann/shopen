const MobileUserController = require('./MobiledUserController')
module.exports = {
  name: 'user',
  created (app) {
    const controller = new MobileUserController(app.context)
    app.context.userController = controller
  },

  ready (app) {
    const router = app.context.router
    app.context.userController.initRoutes(router)
  }
}
