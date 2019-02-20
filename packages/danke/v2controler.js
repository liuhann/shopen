const RestfullDAO = require('../rest/restful-dao')

module.exports = class DankeV2Controller {
  constructor (ctx) {
    this.workdao = new RestfullDAO(ctx.services.mongodb, 'dankev2', 'works')
  }

  initRoutes (router) {
    router.get('/api/danke/v2/work/:uid', this.getWork.bind(this))
    router.post('/api/danke/v2/work', this.addWork.bind(this))
    router.get('/api/danke/v2/works/mine', this.getMyWork.bind(this))
  }

  async getMyWork (ctx, next) {
    ctx.user = 'test'
    const works = await this.workdao.list({
      user: ctx.user
    })
    const result = {
      list: []
    }
    for (let work of works.list) {
      result.list.push({
        id: work.uid,
        user: work.user,
        scenes: work.scenes && work.scenes.length
      })
    }
    ctx.body = result
    await next()
  }

  async addWork (ctx, next) {
    const work = ctx.request.body
    work.openId = ctx.query.openId
    await this.workdao.deleteOne({
      uid: work.uid,
      openId: work.openId
    })
    work.modified = new Date().getTime()
    const result = await this.workdao.insertOne(work)
    ctx.body = {
      uid: work.uid,
      result
    }
    await next()
  }

  async getWork (ctx, next) {
    const result = await this.workdao.getOne({
      uid: ctx.params.uid
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
}
