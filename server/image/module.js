const imageController = require('./controller/image-controller')
const ImageService = require('./service/image')

module.exports = {
  name: 'image',
  
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
