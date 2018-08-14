const VisitDAO = require('./comment-dao')
module.exports = {
  disabled: true,
  async created (app) {
    //app.context.services.visitdao = new VisitDAO()
  },

  ready (app) {
  }
}
