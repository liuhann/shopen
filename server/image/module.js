const imageController = require('./controller/image-controller')
const ImageService = require('./service/image')
const RESTFulController = require('../core/rest-mongo/restful-controller')

module.exports = {
  name: 'image',
  
  async onload (app, router, {mongo}) {
    const db = await mongo.getDb()
    const controller = new RESTFulController('/api/v1', router, db, 'image')
    return controller
  },
  
  services () {
    return {
      'image': new ImageService({
        accessid: 'qOqcheyFld6oyr9L',
        accesskey: '7icKekeMgToGgfXzOIyMai7mOb8rMx',
        host: 'http://shopen-test.oss-cn-beijing.aliyuncs.com'
      })
    }
  },
  
  async routes (router) {
    router.get('/api/oss/policy', imageController.ossUploadPolicy)
  }
}
