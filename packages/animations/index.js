const AnimationController = require('./AnimationController')

module.exports = {
  async created (app) {

  },

  ready (app) {
    const router = app.context.router
    const controller = new AnimationController(app.context)
    controller.initRoutes(router)
  }
}
