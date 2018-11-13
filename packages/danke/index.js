const DankeController = require('./controller')
const DankeDAO = require('./DankeDAO')
module.exports = {
  async created (app) {

  },

  ready (app) {
    const router = app.context.router
    const dankeDao = new DankeDAO(app.context.services.mongodb)
    const controller = new DankeController(null, dankeDao)
    router.get('/danke/templates', controller.getTemplateList.bind(controller))
    router.get('/danke/mini/file/transfer', controller.miniFileTransfer.bind(controller))
  }
}
