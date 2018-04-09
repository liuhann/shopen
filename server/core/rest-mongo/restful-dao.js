class RESTfulDAO {
  constructor (db, coll) {
    this.db = db
    this.coll = coll
  }
  
  async list ({filter, page = 1, size = 50, sort, order}) {
    const coll = this.db.collection(this.coll)
    let cursor = coll.find(filter)
    const total = await cursor.count()
    
    if (sort) {
      cursor = cursor.sort(sort, order)
    }
    const result = await cursor.skip((page - 1) * size).limit(size).toArray()
    
    return {
      page,
      size,
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
}

module.exports = RESTfulDAO
