const RestfullDAO = require('../rest/restful-dao')

module.exports = class DankeV2Controller {
  constructor (ctx) {
    this.ctx = ctx
    this.animationdao = new RestfullDAO(ctx.services.mongodb, 'animations', 'animations')
  }

  initRoutes (router) {
    router.use('/api/animation/add', this.ctx.userController.setUserMiddleWare.bind(this.ctx.userController))

    router.put('/api/animation', this.addAnimation.bind(this))
    router.get('/api/animation/list', this.listAnimations.bind(this))
  }

  async addAnimation (ctx, next) {
    const animation = ctx.request.body
    const result = await this.animationdao.insertOne(animation)
    ctx.body = {
      result
    }
    await next()
  }

  async listAnimations (ctx, next) {
    const animations = await this.animationdao.list(Object.assign({}, ctx.params, {
      filter: {
        $text: {
          $search: ctx.params.name
        }
      }
    }))
    ctx.body = animations
    await next()
  }

  deleteAnimation () {

  }
}
