const UnSplashService = require('./UnSplashService.js')

module.exports = {
  name: 'unsplash',
  async created (app) { },
  ready (app) {
    const router = app.context.router
    const unSplashService = new UnSplashService(app.context.services.mongodb)
    unSplashService.initRoutes(router)
  }
}
