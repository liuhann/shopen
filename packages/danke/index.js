const RestFulController = require('../rest/restful-controller.js')
const config = require('../../config.js')
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
      filter: app.middlewares.loginRequired
    })
    app.context.services.sceneRest.setAdmin(config.admin)
    app.context.services.animationRest = new RestFulController({
      router,
      mongodb: app.context.services.mongodb,
      dbName: 'animations',
      coll: 'animations',
      path: '/danke/animation',
      filter: app.middlewares.loginRequired
    })
    app.context.services.animationRest.setAdmin(config.admin)
    app.context.services.workLinkServie = new RestFulController({
      router,
      mongodb: app.context.services.mongodb,
      dbName: 'danke',
      coll: 'links',
      path: '/danke/link',
      filter: app.middlewares.loginRequired
    })
    app.context.services.workLinkServie.setAdmin(config.admin)
    app.context.services.workLinkServie = new RestFulController({
      router,
      mongodb: app.context.services.mongodb,
      dbName: 'danke',
      coll: 'vectors',
      path: '/danke/vector',
      filter: app.middlewares.loginRequired
    })
    app.context.services.workLinkServie.setAdmin(config.admin)
  }
}
