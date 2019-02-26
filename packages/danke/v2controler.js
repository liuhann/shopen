const RestfullDAO = require('../rest/restful-dao')

module.exports = class DankeV2Controller {
  constructor (ctx) {
    this.workdao = new RestfullDAO(ctx.services.mongodb, 'dankev2', 'works')
  }

  initRoutes (router) {
    router.get('/api/danke/v2/work/:id', this.getWork.bind(this))
    router.delete('/api/danke/v2/work/:id', this.deleteWork.bind(this))
    router.post('/api/danke/v2/work', this.addWork.bind(this))
    router.get('/api/danke/v2/works/mine', this.getMyWork.bind(this))
  }

  async getMyWork (ctx, next) {
    ctx.user = 'test'
    const works = await this.workdao.list({
      filter: {
        user: ctx.user
      }
    })
    const result = {
      list: []
    }
    for (let work of works.list) {
      result.list.push({
        id: work.id,
        user: work.user,
        image: work.images ? work.images[0] : '',
        scenes: work.scenes && work.scenes.length
      })
    }
    ctx.body = result
    await next()
  }

  async deleteWork (ctx, next) {
    ctx.user = 'test'
    await this.workdao.deleteOne({
      id: ctx.params.id,
      user: ctx.user
    })
    ctx.body = {
      result: 'ok'
    }
    await next()
  }
  
  async addWork (ctx, next) {
    const work = ctx.request.body
    work.openId = ctx.query.openId
    await this.workdao.deleteOne({
      id: work.id,
      openId: work.openId
    })
    work.modified = new Date().getTime()
    const result = await this.workdao.insertOne(work)
    ctx.body = {
      id: work.id,
      result
    }
    await next()
  }

  async getWork (ctx, next) {
    const result = await this.workdao.getOne({
      id: ctx.params.id
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
