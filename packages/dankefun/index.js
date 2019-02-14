const DankeController = require('./controller')
module.exports = {
  async created (app) {

  },

  ready (app) {
    const router = app.context.router
    const controller = new DankeController(app.context)
    router.get('/fun/templates', controller.getTemplateList.bind(controller))
  }
}
