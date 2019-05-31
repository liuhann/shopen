const DankeController = require('./controller')
const DankeV2Controler = require('./v2controler')
const RestFulController = require('../rest/restful-controller.js')

module.exports = {
  async created (app) {

  },

  ready (app) {
    const router = app.context.router
    const controller = new DankeController(app.context)
    router.get('/danke/templates', controller.getTemplateList.bind(controller))
    router.get('/danke/template/:name', controller.getTemplate.bind(controller))
    router.post('/danke/template', controller.addTemplate.bind(controller))
    router.patch('/danke/template', controller.patchTemplate.bind(controller))
    router.delete('/danke/template/:name', controller.deleteTemplate.bind(controller))

    router.get('/danke/work/images/:workId', controller.getWorkImages.bind(controller))
    router.get('/danke/mini/file/transfer', controller.miniFileTransfer.bind(controller))

    router.post('/danke/work', controller.addWork.bind(controller))
    router.post('/danke/work/share', controller.shareWork.bind(controller))
    router.get('/danke/work/:uid', controller.getWork.bind(controller))
    router.delete('/danke/work/:uid', controller.deleteWork.bind(controller))
    router.get('/danke/work/mine', controller.getMyWorkList.bind(controller))
    router.get('/danke/work/featured', controller.getFeaturedList.bind(controller))

    router.get('/danke/weixin/me', controller.getWeixinMe.bind(controller))
    router.post('/danke/weixin/me', controller.setWeixinMe.bind(controller))

    const v2controler = new DankeV2Controler(app.context)
    v2controler.initRoutes(router)

    app.context.services.sceneRest = new RestFulController({
      router,
      mongodb: app.context.services.mongodb,
      dbName: 'danke',
      coll: 'scenes',
      path: '/danke/scene',
      filter: app.middlewares.loginRequired
    })
    app.context.services.animationRest = new RestFulController({
      router,
      mongodb: app.context.services.mongodb,
      dbName: 'animations',
      coll: 'animations',
      path: '/danke/animation',
      filter: app.middlewares.loginRequired
    })
  }
}
