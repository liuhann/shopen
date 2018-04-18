const PageService = require('./service/PageService')
const PageController = require('./controller/PageController')
const RESTFulController = require('../rest/restful-controller')

module.exports = {
  name: 'site-page-setting',
  
  async onload (app, router, {mongo}) {
    const db = await mongo.getDb()
    const controller = new RESTFulController('/api/v1', router, db, 'page')
    return controller
  },
  
  async services () {
    return {
      'page': new PageService()
    }
  },

  async routes (router) {
    router.post('/api/page/save', PageController.upsertPage)
  }
}
