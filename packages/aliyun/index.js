const OSSObjectService = require('./OSSObjectService.js')
module.exports = {
  async created (app) {
  },

  ready (app) {
    const router = app.context.router
    const userSpace = new OSSObjectService('dankev3', app.config)
    const publicSpace = new OSSObjectService('danke-public', app.config)
    userSpace.initRoutes(router, app)
    publicSpace.initRoutes(router, app)
  }
}
