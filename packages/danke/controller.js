const TransferHome = '/data/temp'
const shortid = require('shortid')
const RestfullDAO = require('../rest/restful-dao')
const debug = require('debug')('danke:rest')

module.exports = class DankController {
  constructor (ctx) {
    this.templatedao = new RestfullDAO(ctx.services.mongodb, 'danke', 'templates')
    this.imagedao = new RestfullDAO(ctx.services.mongodb, 'danke', 'images')
    this.workdao = new RestfullDAO(ctx.services.mongodb, 'danke', 'works')
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

  async addWork (ctx, next) {
    const work = ctx.request.body
    work.openId = ctx.query.openId
    work.uid = shortid.generate()
    const result = await this.workdao.insertOne(ctx.request.body)
    ctx.body = {
      uid: work.uid,
      result
    }
    await next()
  }

  async shareWork (ctx, next) {
    await this.workdao.patchOne('uid', {
      uid: ctx.request.body.uid,

    })
  }

  async getWork (ctx, next) {
    const result = await this.workdao.getOne({
      name: ctx.params.id
    })
    if (result == null) {
      ctx.body = {
        code: 404
      }
    } else {
      ctx.body = result
    }
    await next()
  }

  async getFeaturedList (ctx, next) {
    const result = await this.workdao.list({
      page: 1,
      count: 24
    })
    const list = []
    for (let work of result.list) {
      list.push({
        name: work.name,
        uid: work.uid,
        cover: work.cover,
        template: work.template
      })
    }
    result.list = list
    ctx.body = result
    await next()
  }

  async patchTemplate (ctx, next) {
    const result = await this.templatedao.patchOne('name', ctx.request.body)
    ctx.body = result
    await next()
  }

  async deleteTemplate (ctx, next) {
    const result = await this.templatedao.deleteOne('name', ctx.params.name)
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
