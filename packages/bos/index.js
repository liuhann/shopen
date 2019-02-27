const BOSService = require('./service')
module.exports = {
  disabled: true,
  async created (app) {
    app.context.services.bos = new BOSService()
  },

  ready (app) {

  }
}
