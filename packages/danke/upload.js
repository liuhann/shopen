const RestfullDAO = require('../rest/restful-dao')

module.exports = class UploadController {
  constructor (ctx) {
    this.filedao = new RestfullDAO(ctx.services.mongodb, 'dankev2', 'uploads')
  }

  initRoutes (router) {
    router.get('/dankev2/file/upload/image', this.uploadImage.bind(this))
  }
  uploadImage (ctx, next) {

  }
}
