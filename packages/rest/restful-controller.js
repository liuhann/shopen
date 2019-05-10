const debug = require('debug')('shopen:restful')
class RESTFullController {
  constructor (router, mongodb, dbName, coll) {
    this.mongodb = mongodb
    this.dbName = dbName
    this.coll = coll
    router.get(`${dbName}/${coll}`, this.list.bind(this))
    router.post(`${dbName}/${coll}`, this.create.bind(this))
    router.patch(`${dbName}/${coll}/:id`, this.patch)
    router.delete(`${dbName}/${coll}/:id`, this.delete)
  }
  getDb () {
    return this.mongodb.getDb(this.dbName)
  }

  async list (ctx, next) {
    let page = parseInt(ctx.request.query.page) || 1
    let count = parseInt(ctx.request.query.count) || 10

    let sort = ctx.request.query.sort
    let order = ctx.request.query.order

    let key = ctx.request.query.key
    let value = ctx.request.query.value

    let filter = {}
    if (key) {
      filter[key] = value
    }
    await getDb()
    const result = await ctx.dao.list({filter, page, count, sort, order})
    ctx.body = result
    await next()
  }

  async create (ctx, next) {
    let object = ctx.request.body
    const result = await ctx.dao.insertOne(object)

    ctx.body = {
      result,
      object
    }
    await next()
  }

  async patch (ctx, next) {
    let objectId = ctx.params.id

    const result = await ctx.dao.patchObject(objectId, ctx.request.body)
    ctx.body = result
    await next()
  }

  async delete (ctx, next) {
    let objectId = ctx.params.id

    const result = await ctx.dao.patchObject(objectId, ctx.request.body)
    ctx.body = result
    await next()
  }
}

module.exports = RESTFullController
