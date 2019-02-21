const RestfullDAO = require('../rest/restful-dao')
const OSS = require('ali-oss')
const shortid = require('shortid')

module.exports = class UploadController {
  constructor (ctx) {
    this.filedao = new RestfullDAO(ctx.services.mongodb, 'dankev2', 'uploads')
    this.client = new OSS({
	    region: 'oss-cn-beijing',
      accessKeyId: 'qOqcheyFld6oyr9L',
      accessKeySecret: '7icKekeMgToGgfXzOIyMai7mOb8rMx',
      bucket: 'dankev3'
    })
  }

  initRoutes (router) {
    router.post('/api/danke/v2/image/upload', this.uploadImage.bind(this))
  }
  
  async uploadImage (ctx, next) {
    const body = ctx.request.body
    const result = {}
    
    for (const fileName in body.files) {
      const uploadFile = body.files[fileName]
      try {
        const fileId = shortid.generate()
	      console.log('upload ', fileId, uploadFile.path)
        // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
        let r1 = await this.client.put(fileId, uploadFile.path)
        result.r1 = r1
      } catch (e) {
        console.error('error2: %j', e)
      }
    }
    ctx.body = result
    await next()
  }
}
