const VisitDAO = require('./dao')
module.exports = {
  async created (app) {
    app.context.services.visitdao = new VisitDAO()
  },

  ready (app) {
  }
}
