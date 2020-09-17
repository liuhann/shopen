const OSSObjectService = require('./OSSObjectService.js')
module.exports = {
  async created (app) {
  },

  ready (app) {
    const router = app.context.router
    const common = new OSSObjectService('dankev3', app.config)
    common.initRoutes(router, app)
  }
}
