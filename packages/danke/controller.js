const TransferHome = '/data/temp'
const shortid = require('shortid')

module.exports = class DankController {
  constructor (service, dao) {
    this.service = service
    this.dao = dao
  }
  async getTemplateList (ctx, next) {
    const result = await this.dao.getTemplates()
    ctx.body = result
    await next()
  }

  async miniFileTransfer (ctx, next) {
    console.log(ctx.query.url)
    const uuid = shortid.generate()
    const localFile = `${TransferHome}/${uuid}`
    await ctx.services.file.transfer(ctx.query.url, localFile)
    await ctx.services.bos.uploadLocalFileToBOS('danke', uuid, localFile)

    ctx.body = {
      url: ctx.query.url,
      uuid: uuid
    }
    await next()
  }
}
