const debug = require('debug')('shopen:core:mongo')
const MongoClient = require('mongodb').MongoClient

class MongodbService {
  constructor ({url, dbName}) {
    this.url = url
    this.dbName = dbName
    this.db = this.getDb()
  }

  async getDb () {
    if (this.db != null) {
      return this.db
    } else {
      let client
      try {
        // Use connect method to connect to the Server
        client = await MongoClient.connect(this.url)
        this.db = client.db(this.dbName)
        debug('mongodb connected ' + this.url)
        return this.db
      } catch (err) {
        debug('mongo db connect fail ' + this.url)
        // console.log(err.stack);
        if (client) {
          client.close()
        }
      }
    }
  }
  
  async ensureSequence (name, start) {
    const db = await this.getDb()
    const one = await db.collection('counter').findOne({
      _id: name
    })
    if (!one) {
      await db.collection('counter').insertOne({
        _id: name,
        seq: start
      })
    }
  }
  
  async getNextSequence (name) {
    var ret = await this.getDb().collection('counter').findOneAndUpdate({
      _id: name
    }, {
      $inc: { seq: 1 }
    })
    return ret.seq
  }
}

module.exports = MongodbService