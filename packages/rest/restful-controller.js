const bson = require('bson')
const debug = require('debug')('shopen:restful')

class RESTFullController {
  constructor ({ path, router, mongodb, dbName, coll, filter }) {
    this.mongodb = mongodb
    this.dbName = dbName
    this.coll = coll
    router.get(`${path}`, this.list.bind(this))
    router.get(`${path}/:id`, this.getOne.bind(this))
    router.get(`${path}/regex/:prop/:value`, this.regex.bind(this))
    let middleware = filter || (async (ctx, next) => {
      await next()
    })
    router.post(`${path}`, middleware, this.create.bind(this))
    router.patch(`${path}/:id`, middleware, this.patch.bind(this))
    router.delete(`${path}/:id`, middleware, this.delete.bind(this))

    debug('rest service booted ' + path)
  }
  getDb () {
    return this.mongodb.getDb(this.dbName)
  }
  setAdmin (admin) {
    this.admin = admin
  }
  /**
   * 正则查找
   */
  async regex (ctx, next) {
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    const count = ctx.request.query.count || 1000
    const query = {}
    query[ctx.params.prop] = {
      $regex: ctx.params.value
    }
    const cursor = await coll.find(query).limit(count)
    const result = await cursor.toArray()
    ctx.body = {
      result
    }
    await next()
  }

  async list (ctx, next) {
    debug(`REST list ${ctx.path}?${ctx.querystring}`)
    let page = parseInt(ctx.request.query.page) || 1
    let count = parseInt(ctx.request.query.count) || 10
    let sort = ctx.request.query.sort
    let order = ctx.request.query.order
    let projection = ctx.request.query.projection
    const query = Object.assign({}, ctx.request.query)
    delete query.page
    delete query.count
    delete query.sort
    delete query.page
    delete query.token
    delete query.order
    delete query.projection
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
    if (projection) {
      const fields = projection.split(',')
      const projecObject = {}
      for (let field of fields) {
        const arrayProjection = field.split('.')
        if (arrayProjection.length === 1) {
          // object projection
          projecObject[field] = 1
        } else {
          // array projection with splice
          projecObject[arrayProjection[0]] = {
            $slice: parseInt(arrayProjection[1])
          }
        }
      }
      cursor.project(projecObject)
    }
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
    object.creator = ctx.user.id
    object.created = new Date().getTime()
    object.updated = object.created
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    const result = await coll.insertOne(object)
    ctx.body = {
      result,
      object
    }
    await next()
  }

  async getOne (ctx, next) {
    let objectId = ctx.params.id
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    const found = await coll.findOne({
      '_id': new bson.ObjectID(objectId)
    })
    if (found) {
      ctx.body = found
    } else {
      ctx.body = {
        code: 404
      }
    }
    await next()
  }
  async patch (ctx, next) {
    const body = ctx.request.body
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    const setProperties = Object.assign({}, body)
    // only admin can modify prop.system
    if (setProperties.system && ctx.user.id !== this.admin) {
      debug(`Patch prop.system ${ctx.user.id} !== ${this.admin}`)
      ctx.throw(403)
      return
    }
    setProperties.updated = new Date().getTime()
    if (setProperties._id) {
      delete setProperties._id
    }
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
    const found = await coll.findOne({
      '_id': new bson.ObjectID(objectId)
    })
    if (found) {
      // only the creator and admin can perform deleting
      if (found.creator === ctx.user.id || ctx.user.id === this.admin) {
        const deleted = await coll.deleteOne({
          '_id': new bson.ObjectID(objectId)
        })
        ctx.body = {
          deleted
        }
      } else {
        ctx.throw(403)
      }
    }
    await next()
  }
}

module.exports = RESTFullController
