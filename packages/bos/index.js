const BOSService = require('./service')
module.exports = {
  async created (app) {
    app.context.services.bos = new BOSService()
  },

  ready (app) {

  }
}
