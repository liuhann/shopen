const HttpError = require('http-errors')

class AuthDAO {
  constructor (db) {
    this.mongo = db
    this.mongo.ensureSequence('user', 1000)
  }

  async checkUser (email, pwd) {
    const db = await this.mongo.getDb()
    const found = await db.collection('user').findOne({
      email, pwd
    })
    if (!found) {
      return false
    } else {
      return true
    }
  }

  async register (userObject) {
    const db = await this.mongo.getDb()
    const found = await db.collection('user').findOne({
      email: userObject.email
    })
    if (found) {
      return -1
    }
    
    const inc = await this.mongo.getNextSequence('user')
    
    userObject.inc = inc
    const result = await db.collection('user').insertOne(userObject)
    return result
  }
}

module.exports = AuthDAO
