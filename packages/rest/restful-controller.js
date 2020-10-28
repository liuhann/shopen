const debug = require('debug')('restful')
const { MongoError, ObjectID } = require('mongodb')

const checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

class RESTFullController {
  constructor ({ path, router, mongodb, dbName, coll, filter }) {
    this.mongodb = mongodb
    this.dbName = dbName
    this.coll = coll
    router.get(`${path}`, this.list.bind(this))
    router.get(`${path}/:id`, async (ctx, next) => {
      ctx.body = await this.getOne(ctx.params.id)
      await next()
    })
    router.post(`${path}/id`, this.getMulti.bind(this))
    router.post(`${path}/distinct/:field`, this.distinct.bind(this))
    router.get(`${path}/regex/:prop/:value`, this.regex.bind(this))
    let middleware = filter || (async (ctx, next) => {
      await next()
    })
    router.post(`${path}`, middleware, this.create.bind(this))
    router.patch(`${path}/:id`, middleware, async (ctx, next) => {
      ctx.body = await this.patch(ctx.params.id, ctx.request.body)
      await next()
    })
    router.delete(`${path}/:id`, middleware, this.delete.bind(this))
    debug('rest service booted ' + path)
  }
  getDb () {
    return this.mongodb.getDb(this.dbName)
  }
  setAdmin (admin) {
    this.admin = admin
  }

  async ensureIndex (indexKey, {
    overwriteOnDuplicated
  }) {
    const db = await this.getDb()
    await db.collection(this.coll).createIndex({
      [indexKey]: 1
    }, {
      unique: true
    })
    this.indexKey = indexKey
    debug(`ensure index ${this.coll}: ${indexKey}`)
    this.overwriteOnDuplicated = overwriteOnDuplicated
  }

  /**
   * 设置子集和对应的外键， 主要用于目录、文件这类包含子项应用场景
   * @param subColl 子集名称
   * @param subCollForeignKey  子集文档外键 指向当前集合的id
   * @param collKey 父文档标记字段，默认为_id
   * @returns {Promise<void>}
   */
  setSubCollection (subColl, subCollForeignKey, collKey) {
    this.subColl = subColl
    this.subCollForeignKey = subCollForeignKey
    this.parentCollKey = collKey
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
    delete query.order
    delete query.projection

    const db = await this.getDb()
    const coll = db.collection(this.coll)

    // consider value convert to true or false
    for (let key in query) {
      if (query[key] === 'true' || query[key] === 'false') {
        query[key] = JSON.parse(query[key])
      }
    }
    console.log('query', query)
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

  /**
   * 创建一条文档，如何发生主键重复时， overwriteOnDuplicated 可配置是否可替换
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  async create (ctx, next) {
    let object = ctx.request.body
    object.creator = ctx.user.id
    object.created = new Date().getTime()
    object.updated = object.created
    object.token = ctx.token
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    let result = null
    for (let key in object) {
      if (key.match(/^_[a-z]+_id$/)) {
        object[key] = new ObjectID(object[key])
      }
    }
    try {
      result = await coll.insertOne(object, {
        bypassDocumentValidation: true
      })
    } catch (e) {
      if (e instanceof MongoError) {
        debug('err', e)
        if (this.overwriteOnDuplicated) {
          debug(`overwrite duplicated  ${this.coll} ${this.indexKey}=${object[this.indexKey]}`)
          await coll.deleteOne({
            [this.indexKey]: object[this.indexKey]
          })
          result = await coll.insertOne(object)
          debug('removed and inserted new')
        }
      }
    }
    ctx.body = {
      result,
      object
    }
    await next()
  }

  async getMulti (ctx, next) {
    let ids = ctx.request.body.ids
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    if (ids) {
      let cursor = coll.find({
        _id: {
          $in: ids.map(id => new ObjectID(id))
        }
      })
      const list = await cursor.toArray()
      ctx.body = {
        list
      }
    } else {
      ctx.body = {
        code: 400,
        msg: 'ids fields required in body'
      }
    }
    await next()
  }

  async getOne (objectId) {
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    try {
      let found = null
      if (checkForHexRegExp.test(objectId)) {
        found = await coll.findOne({
          '_id': new ObjectID(objectId)
        })
      } else {
        found = await coll.findOne({
          [this.indexKey || '_id']: objectId
        })
      }
      if (found) {
        return found
      } else {
        return {
          code: 404
        }
      }
    } catch (e) {
      debug('rest get one error:', e)
      return {
        code: 400,
        msg: 'Bad Request Parameter'
      }
    }
  }

  /**
   * 更新文档
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  async patch (objectId, body) {
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    const setProperties = Object.assign({}, body)

    setProperties.updated = new Date().getTime()
    if (setProperties._id) {
      delete setProperties._id
    }

    const query = checkForHexRegExp.test(objectId) ? {
      '_id': new ObjectID(objectId)
    }: {
      [this.indexKey || '_id']: objectId
    }
    const result = await coll.findOneAndUpdate(query, {
      $set: setProperties
    })
    return result
  }

  async delete (ctx, next) {
    let objectId = ctx.params.id
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    const found = await coll.findOne({
      '_id': new ObjectID(objectId)
    })
    if (found) {
      // 匿名删除
      if ((found.creator == null && ctx.token === found.token) || found.token == null) {
        const deleted = await coll.deleteOne({
          '_id': new ObjectID(objectId)
        })
        ctx.body = {
          deleted
        }
        await next()
        return
      }

      if (!ctx.user || !ctx.user.id) { // only the creator and admin can perform deleting
        ctx.throw(403)
      }
      if (found.creator === ctx.user.id || ctx.user.id === this.admin) {
        const deleted = await coll.deleteOne({
          '_id': new ObjectID(objectId)
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

  /**
   * 获取coll的distinct列值
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  async distinct (ctx, next) {
    let { field } = ctx.params
    const db = await this.getDb()
    const coll = db.collection(this.coll)
    const distinctValue = await coll.distinct(field, ctx.request.body)
    ctx.body = distinctValue
    await next()
  }
}

module.exports = RESTFullController
