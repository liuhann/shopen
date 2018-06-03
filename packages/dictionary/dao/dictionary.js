class DictionaryDAO {
  constructor (db) {
    this.mongo = db
  }
  
  async addDictionary (user, namespace, key, opts) {
    const db = await this.mongo.getDb()
    
    const result = await db.collection('dictionary').findOneAndUpdate({
      user,
      namespace,
      key
    }, Object.assign(opts || {}, {
      user,
      namespace,
      key
    }), {
      upsert: true,
      multi: false
    })
    return result
  }
  
  async updateDictory (user, namespace, key, opts) {
    const db = await this.mongo.getDb()
    db.collection('dictionary').updateOne({
      user,
      namespace,
      key
    }, {
      $set: opts
    }, {
      upsert: false,
      multi: false
    })
  }
  
  async increaseDictory (user, namespace, key, incKey, inc) {
    const db = await this.mongo.getDb()
    const incObject = {}
    incObject[incKey] = inc || 1
    db.collection('dictionary').findOneAndUpdate({
      user,
      namespace,
      key
    }, {
      $inc: incObject[incKey]
    })
  }
  
  async getDictionaryKeys (user, namespace) {
    const db = await this.mongo.getDb()
    const dicts = db.collection('dictionary').find({
      user,
      namespace
    }).limit(1000).toArray()
    return dicts
  }
}

module.exports = DictionaryDAO
