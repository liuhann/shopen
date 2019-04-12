const RestfullDAO = require('../rest/restful-dao')

module.exports = class DankeV2Controller {
  constructor (ctx) {
    this.ctx = ctx
    this.animationdao = new RestfullDAO(ctx.services.mongodb, 'animations', 'animations')
  }

  initRoutes (router) {
    router.put('/api/animation', this.addAnimation.bind(this))

    router.get('/api/animation/list', this.listAnimations.bind(this))
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

  async listAnimations (ctx, next) {
    const filters = {}
    if (ctx.params.name) {
      filters.filter = {
        $text: {
          $search: ctx.params.name
        }
      }
    }
    const animations = await this.animationdao.list(Object.assign({}, ctx.params, filters))
    ctx.body = animations
    await next()
  }

  deleteAnimation () {

  }
}
