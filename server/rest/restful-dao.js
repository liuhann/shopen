const debug = require('debug')('shopen:class:restdao')
const {ObjectID} = require('mongodb')

class RESTfulDAO {
  constructor (db, coll) {
    this.db = db
    this.coll = coll
  }
  
  async list ({filter, page, count, sort, order}) {
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
    const inserted = await this.db.collection(this.coll).insertOne(object)
    return {
      inserted
    }
  }
  
  async patchObject (id, set) {
    const updated = await this.db.collection(this.coll).updateOne({
      _id: new ObjectID(id)
    }, {
      $set: set
    }, {
      upsert: false,
      multi: false
    })
    return updated
  }
}

module.exports = RESTfulDAO
