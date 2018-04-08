const PageService = require('./service/PageService')
const PageController = require('./controller/PageController')

module.exports = {
  name: 'site-page-setting',
  type: '',

  async services () {
    return {
      'page': new PageService()
    }
  },

  async routes (router) {
    router.post('/api/page/save', PageController.upsertPage)
  }
}
