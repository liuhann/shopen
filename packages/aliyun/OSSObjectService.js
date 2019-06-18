const OSS = require('ali-oss')
const shortid = require('shortid')
const OSS_CONFIG = {
  region: 'oss-cn-beijing',
  accessKeyId: 'qOqcheyFld6oyr9L',
  accessKeySecret: '7icKekeMgToGgfXzOIyMai7mOb8rMx'
}

module.exports = class OSSObjectService {
  constructor (bucket) {
    this.config = Object.assign({}, OSS_CONFIG)
    this.config.bucket = bucket
    this.client = new OSS(this.config)
  }

  initRoutes (router, app) {
    router.post(`/image/upload`, app.middlewares.loginRequired, this.uploadImage.bind(this))
  }
  async uploadImage (ctx, next) {
    const body = ctx.request.body
    const result = {}
    for (const fileName in body.files) {
      const uploadFile = body.files[fileName]
      try {
        const fileDir = ctx.user.id
        let fileId = fileDir + '/' + shortid.generate() + '_' + uploadFile.name

        if (!this.fileExtension(fileId)) {
          fileId = fileId + '.png'
        }
        // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
        let r1 = await this.client.put(fileId, uploadFile.path)
        result.r1 = r1
        result.url = `https://${this.config.bucket}.${this.config.region}.aliyuncs.com/${fileId}`
      } catch (e) {
        console.error('error2: %j', e)
      }
    }
    ctx.body = result
    await next()
  }
  // from https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
  fileExtension (fname) {
    return fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
  }
}
