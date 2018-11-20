const DankeController = require('./controller')
const DankeDAO = require('./DankeDAO')
module.exports = {
  async created (app) {

  },

  ready (app) {
    const router = app.context.router
    const dankeDao = new DankeDAO(app.context.services.mongodb)
    const controller = new DankeController(app.context)
    router.get('/danke/templates', controller.getTemplateList.bind(controller))
    router.get('/danke/template/:name', controller.getTemplate.bind(controller))
    router.post('/danke/template', controller.addTemplate.bind(controller))
    router.patch('/danke/template', controller.patchTemplate.bind(controller))
    router.delete('/danke/template/:name', controller.deleteTemplate.bind(controller))

    router.get('/danke/show/images/:show', controller.getShowImages.bind(controller))
    router.get('/danke/mini/file/transfer', controller.miniFileTransfer.bind(controller))

    router.post('/danke/work', controller.addWork.bind(controller))
    router.post('/danke/work/share', controller.shareWork.bind(controller))
    router.get('/danke/work/:id', controller.getWork.bind(controller))
    router.get('/danke/work/featured', controller.getFeaturedList.bind(controller))
  }
}
