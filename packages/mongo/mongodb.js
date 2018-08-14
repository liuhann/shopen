const debug = require('debug')('shopen:core:mongo')
const MongoClient = require('mongodb').MongoClient

class MongodbService {
  constructor ({url, dbName}) {
    this.url = url
    this.dbName = dbName
  }

  async connect () {
    try {
      // Use connect method to connect to the Server
      this.client = await MongoClient.connect(this.url)
    } catch (err) {
      debug('mongo db connect fail ' + this.url)
      // console.log(err.stack);
      if (this.client) {
        this.client.close()
      }
    }
  }

  async getDb (dbName) {
    return this.client.db(dbName || this.dbName)
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
