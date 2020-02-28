const OSS = require('ali-oss')
const fs = require('fs')
const shortid = require('shortid')
const MP3Cutter = require('mp3-cutter')
const config = require('../../config.js')

const OSS_CONFIG = {
  region: 'oss-cn-beijing',
  accessKeyId: config.aliyun.accessKeyId,
  accessKeySecret: config.aliyun.accessKeySecret
}

module.exports = class OSSObjectService {
  constructor (bucket) {
    this.config = Object.assign({}, OSS_CONFIG)
    this.config.bucket = bucket
    this.client = new OSS(this.config)
  }

  initRoutes (router, app) {
    router.post(`/image/upload`, this.uploadImage.bind(this))
    router.post(`/image/remove`, app.middlewares.loginRequired, this.removeImage.bind(this))
    router.post(`/mp3/upload`, this.uploadAndCutMp3.bind(this))
  }

  /**
   * 上传并剪切mp3 文件
   * @param {Context}} ctx koa context
   * @param {Function} next next function
   */
  async uploadAndCutMp3 (ctx, next) {
    const body = ctx.request.body
    const result = {}
    if (ctx.query.start == null || ctx.query.end == null) {
      ctx.throw(400)
    }
    for (const fileName in body.files) {
      const uploadFile = body.files[fileName]
      // 调用剪切mp3
      MP3Cutter.cut({
        src: uploadFile.path,
        target: uploadFile.path + '_cutted',
        start: parseInt(ctx.query.start) || 0,
        end: parseInt(ctx.query.end) || 100
      })
      try {
        let fileId = ctx.query.path
        // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
        console.log('cut mp3 path', uploadFile.path + '_cutted')
        let r1 = await this.client.put(fileId, uploadFile.path + '_cutted')
        result.r1 = r1
        result.name = fileId
        result.url = `https://${this.config.bucket}.${this.config.region}.aliyuncs.com/${fileId}`
        fs.unlinkSync(uploadFile.path + '_cutted')
      } catch (e) {
        console.error('cut error', e)
      }
    }
    ctx.body = result
    await next()
  }

  async removeImage (ctx, next) {
    const body = ctx.request.body
    try {
      await this.client.delete(body.fileId)
    } catch (e) {
      console.error('delete error', e)
    }
    ctx.body = {
      code: 201
    }
  }
  async uploadImage (ctx, next) {
    const body = ctx.request.body
    const result = {}
    for (const fileName in body.files) {
      const uploadFile = body.files[fileName]
      try {
        const fileDir = ctx.user.id || 'anonymous'
        let fileId = fileDir + '/' + ctx.query.path + '/' + shortid.generate() + '.' + (this.fileExtension(uploadFile.name) || 'png')
        // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
        let r1 = await this.client.put(fileId, uploadFile.path)
        result.r1 = r1
        result.name = fileId
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
