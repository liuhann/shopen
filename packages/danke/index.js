const RestFulController = require('../rest/restful-controller.js')
const publishFilter = require('./filters/publish.js')
module.exports = {
  async created (app) {

  },
  ready (app) {
    const router = app.context.router
    app.context.services.sceneRest = new RestFulController({
      router,
      mongodb: app.context.services.mongodb,
      dbName: 'danke',
      coll: 'works',
      path: '/danke/work',
      filter: [app.middlewares.loginRequired, publishFilter]
    })
    app.context.services.animationRest = new RestFulController({
      router,
      mongodb: app.context.services.mongodb,
      dbName: 'animations',
      coll: 'animations',
      path: '/danke/animation',
      filter: app.middlewares.loginRequired
    })
  }
}
