const RestFulController = require('../rest/restful-controller.js')
const config = require('../../config.js')

function initRestService (app, db, coll, path, noLogin) {
  const router = app.context.router
  app.context.services[coll + '.rest'] = new RestFulController({
    router,
    mongodb: app.context.services.mongodb,
    dbName: db,
    coll: coll,
    path: path,
    filter: noLogin === true ? null : app.middlewares.loginRequired
  })
  app.context.services[coll + '.rest'].setAdmin(config.admin)
}
module.exports = {
  async created (app) {
  },
  ready (app) {
    initRestService(app, 'danke', 'works', '/danke/work', true)
    initRestService(app, 'animations', 'animations', '/danke/animation')
    initRestService(app, 'danke', 'vectors', '/danke/vector')
    initRestService(app, 'danke', 'audios', '/danke/audio')
    initRestService(app, 'danke', 'oaudios', '/danke/oaudio', true)
  }
}
