const TransferHome = '/data/temp'
const shortid = require('shortid')
const RestfullDAO = require('../rest/restful-dao')
const debug = require('debug')('danke:rest')

module.exports = class DankController {
  constructor (ctx) {
    this.templatedao = new RestfullDAO(ctx.services.mongodb, 'danke', 'templates')
    this.imagedao = new RestfullDAO(ctx.services.mongodb, 'danke', 'images')
  }
  async getTemplateList (ctx, next) {
    const result = await this.templatedao.list(ctx.request.query)
    ctx.body = result
    await next()
  }

  async getTemplate (ctx, next) {
    const result = await this.templatedao.getOne({
      name: ctx.params.name
    })
    if (result == null) {
      ctx.throw(404, 'template not found')
    }
    ctx.body = result
    await next()
  }

  async addTemplate (ctx, next) {
    const result = await this.templatedao.insertOne(ctx.request.body)
    ctx.body = result
    await next()
  }

  async patchTemplate (ctx, next) {
    const result = await this.templatedao.patchObject('name', ctx.request.body)
    ctx.body = result
    await next()
  }

  async miniFileTransfer (ctx, next) {
    debug(`transfer ${ctx.query.url} ${ctx.query.showid}`)
    const uuid = shortid.generate() + '.' + ctx.services.file.fileExtension(ctx.query.url)
    const localFile = `${TransferHome}/${uuid}`
    await ctx.services.file.transfer(ctx.query.url, localFile)
    await ctx.services.bos.uploadLocalFileToBOS('danke', uuid, localFile)

    await this.imagedao.insertOne({
      show: ctx.query.showid,
      uuid: uuid
    })
    ctx.body = {
      url: ctx.query.url,
      uuid: uuid
    }
    await next()
  }

  async getShowImages (ctx, next) {
    const result = await this.imagedao.list({
      filter: {
        show: ctx.params.show
      },
      count: 1000
    })
    ctx.body = result
    await next()
  }
}
