const RestfulController = require('../rest/restful-controller')

module.exports = {
  async created (app) {
    RestfulController('/api/v1',
      await app.context.services.router,
      await app.context.services.mongodb, 'image')
  },

  ready (app) {

  }

}
