const debug = require('debug')('shopen:restful:dao')
const {ObjectID} = require('mongodb')
const compose = require('koa-compose')

class RESTfulDAO {
  constructor (mongodb, dbName, coll, plugins) {
    this.mongodb = mongodb
    this.dbName = dbName
    this.coll = coll
    this.middleware = plugins ? compose(plugins) : null
  }

  getDb () {
    return this.mongodb.getDb(this.dbName)
  }

  async list ({filter, page, count, sort, order, fields}) {
    const db = await this.getDb()
    page = page || 1
    if (page < 1) {
      page = 1
    }
    count = count || 100
    const coll = db.collection(this.coll)
    let projection = {}
    if (fields) {

    }
    let cursor = coll.find(filter, projection)
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
    debug(`listing ${this.coll} filter: ${filter && JSON.stringify(filter)} page: ${page} count: ${count}`)
    const result = await cursor.skip((page - 1) * count).limit(count).toArray()
    return {
      page,
      count,
      filter,
      sort,
      order,
      total,
      list: result
    }
  }

  async getOne (query) {
    const db = await this.getDb()
    const found = await db.collection(this.coll).findOne(query)
    return found
  }

  async insertOne (object) {
    const db = await this.getDb()
    if (this.middleware) {
      await this.middleware({type: 'insert', object})
    }
    const inserted = await db.collection(this.coll).insertOne(object)
    return {
      inserted
    }
  }

  async patchOne (key, set) {
    const db = await this.getDb()
    const query = {}
    const value = set[key]
    if (!value) {
      return {
        'desc': 'value required'
      }
    }
    if (key === '_id') {
      query._id = new ObjectID(value)
    } else {
      query[key] = value
    }
    const updated = await db.collection(this.coll).updateOne(query, {
      $set: set
    }, {
      upsert: false,
      multi: false
    })
    return updated
  }

  async deleteOne (query) {
    let result = null
    const db = await this.getDb()
    if (query['_id'] && typeof query['_id'] === 'string') {
      query['_id'] = new ObjectID(query['_id'])
    }
    result = await db.collection(this.coll).deleteOne(query)
    return result
  }
}

module.exports = RESTfulDAO
