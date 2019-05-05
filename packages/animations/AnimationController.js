const RestfullDAO = require('../rest/restful-dao')
const debug = require('debug')('animation')
module.exports = class DankeV2Controller {
  constructor (ctx) {
    this.ctx = ctx
    this.animationdao = new RestfullDAO(ctx.services.mongodb, 'animations', 'animations')
  }

  initRoutes (router) {
    router.put('/animation', this.addAnimation.bind(this))
    router.delete('/animation', this.deleteAnimation.bind(this))
    router.get('/animation/list', this.listAnimations.bind(this))
  }

  async addAnimation (ctx, next) {
    const animation = ctx.request.body

    if (!ctx.user.id) {
      ctx.body = {
        code: 401
      }
      await next()
      return
    }

    const found = await this.animationdao.getOne({
      name: animation.name
    })
    if (found && ctx.user.id !== found.userid) {
      ctx.body = {
        code: 409
      }
    } else {
      if (found) {
        await this.animationdao.deleteOne({
          name: animation.name
        })
      }
      animation.userid = ctx.user.id
      const result = await this.animationdao.insertOne(animation)
      ctx.body = {
        result
      }
    }
    await next()
  }

  async deleteAnimation (ctx, next) {
    debug('delete animation', ctx.query._id)
    if (!ctx.user.id) {
      ctx.body = {
        code: 401
      }
      await next()
      return
    }
    const deleted = await this.animationdao.deleteOne({
      userid: ctx.user.id,
      _id: ctx.query._id
    })
    ctx.body = {
      deleted
    }
    await next()
  }

  async listAnimations (ctx, next) {
    const filters = {}
    if (ctx.query.name) {
      filters.filter = {
        $text: {
          $search: ctx.query.name
        }
      }
    }
    if (ctx.query.type) {
      filters.type = ctx.query.type
    }
    const animations = await this.animationdao.list(Object.assign({}, ctx.query, {filter: filters}))
    ctx.body = animations
    await next()
  }
}
