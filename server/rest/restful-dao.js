const debug = require('debug')('shopen:restful:dao')
const {ObjectID} = require('mongodb')
const compose = require('koa-compose')

class RESTfulDAO {
  constructor (db, coll, plugins) {
    this.db = db
    this.coll = coll
    this.middleware = plugins ? compose(plugins) : (ctx, next) => { }
  }
  
  async list ({filter, page, count, sort, order}) {
    await this.middleware({type: 'list', filter, page, count, sort, order})
    
    const coll = this.db.collection(this.coll)
    let cursor = coll.find(filter)
    const total = await cursor.count()
    
    if (sort) {
      const sortObject = {}
      sortObject[sort] = parseInt(order)
      cursor = cursor.sort(sortObject)
    }
    debug(filter, page, count, sort, order)
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
  
  async insertOne (object) {
    await this.middleware({type: 'insert', object})
    const inserted = await this.db.collection(this.coll).insertOne(object)
    return {
      inserted
    }
  }
  
  async patchObject (id, set) {
    const query = {}
    query._id = new ObjectID(id)
    await this.middleware({type: 'patch', query, set})
    const updated = await this.db.collection(this.coll).updateOne(query, {
      $set: set
    }, {
      upsert: false,
      multi: false
    })
    return updated
  }
  
  async deleteOne (id) {
    const deleted = await this.db.collection(this.coll).deleteOne({
      _id: new ObjectID(id)
    })
    return deleted
  }
}

module.exports = RESTfulDAO
