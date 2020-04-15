const RestFulController = require('./restful-controller.js')
const config = require('../../config.js')

function initRestService (app, db, coll, path, noLogin) {
  const router = app.context.router
  const controller = new RestFulController({
    router,
    mongodb: app.context.services.mongodb,
    dbName: db,
    coll: coll,
    path: path,
    filter: noLogin === true ? null : app.middlewares.loginRequired
  })
  app.context.services[coll + '.rest'] = controller
  app.context.services[coll + '.rest'].setAdmin(config.admin)
  return controller
}

module.exports = initRestService
