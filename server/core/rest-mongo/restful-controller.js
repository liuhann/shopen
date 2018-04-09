const RESTFullDAO = require('./restful-dao')

class RESTFullController {
  constructor (basePath, router, db, coll) {
    this.dao = new RESTFullDAO(db, coll)
    router.use(`${basePath}/${coll}`, async (ctx, next) => {
      ctx.dao = this.dao
      await next()
    })
    
    router.get(`${basePath}/${coll}`, this.list)
    router.post(`${basePath}/${coll}`, this.create)
  }
  
  async list (ctx, next) {
    let page = parseInt(ctx.request.query.page) || 1
    let count = parseInt(ctx.request.query.count) || 10
    
    let sort = ctx.request.query.sort
    let order = ctx.request.query.order
    
    let key = ctx.request.query.key
    let value = ctx.request.query.v
    
    let filter = {}
    if (key) {
      filter[key] = value
    }
    const result = await ctx.dao.list({filter, page, count, sort, order})
    ctx.body = result
    await next()
  }
  
  async create (ctx, next) {
    let object = ctx.request.body
    const result = await this.dao.insertOne(object)
    
    ctx.body = result
    next()
  }
}

module.exports = RESTFullController
