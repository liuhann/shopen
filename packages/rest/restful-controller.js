const bson = require('bson')
const debug = require('debug')('shopen:restful')

class RESTFullController {
  constructor ({ path, router, mongodb, dbName, coll }) {
    this.mongodb = mongodb
    this.dbName = dbName
    this.coll = coll
    router.get(`${path}/list`, this.list.bind(this))
    router.get(`${path}/regex/:prop/:value`, this.regex.bind(this))
    router.post(`${path}/${coll}`, this.create.bind(this))
    router.patch(`${path}/:id`, this.patch.bind(this))
    router.delete(`${path}/:id`, this.delete.bind(this))
  }
  getDb () {
    return this.mongodb.getDb(this.dbName)
  }

  /**
   * 正则查找
   */
  async regex (ctx, next) {
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    const query = {}
    query[ctx.params.prop] = {
      $regex: ctx.params.value
    }
    const cursor = await coll.find(query)
    const result = await cursor.toArray()
    ctx.body = {
      result
    }
    await next()
  }

  async list (ctx, next) {
    let page = parseInt(ctx.request.query.page) || 1
    let count = parseInt(ctx.request.query.count) || 10
    let sort = ctx.request.query.sort
    let order = ctx.request.query.order
    const query = Object.assign({}, ctx.request.query)
    delete query.page
    delete query.count
    delete query.sort
    delete query.page
    delete query.token
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    let cursor = coll.find(query)
    const total = await cursor.count()
    if (sort) {
      const sortObject = {}
      sortObject[sort] = parseInt(order)
      cursor = cursor.sort(sortObject)
    } else {
      cursor = cursor.sort({
        $natural: -1
      })
    }
    debug(`listing ${this.coll} filter: ${query && JSON.stringify(query)} page: ${page} count: ${count}`)
    const list = await cursor.skip((page - 1) * count).limit(count).toArray()
    ctx.body = {
      page,
      count,
      query,
      sort,
      order,
      total,
      list
    }
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
    const body = ctx.request.body
    const db = await this.getDb()
    const coll = db.collection(this.coll)

    const setProperties = Object.assign({}, body)
    setProperties.u = new Date().getTime()
    let objectId = ctx.params.id
    await coll.findOneAndUpdate({
      '_id': new bson.ObjectID(objectId)
    }, {
      $set: setProperties
    })
    ctx.body = {
      code: 204
    }
    await next()
  }

  async delete (ctx, next) {
    let objectId = ctx.params.id
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    const deleted = await coll.deleteOne({
      '_id': new bson.ObjectID(objectId)
    })
    ctx.body = {
      deleted
    }
    await next()
  }
}

module.exports = RESTFullController
