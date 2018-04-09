const DAOError = require('../../core/mongo/dao-error')

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
      throw new DAOError(403, '用户名或者密码无效')
    }
  }

  async register (userObject) {
    const db = await this.mongo.getDb()
    const found = await db.collection('user').findOne({
      email: userObject.email
    })
    if (found) {
      throw new DAOError(409, '用户已经注册')
    }
    
    const inc = await this.mongo.getNextSequence('user')
    
    userObject.inc = inc
    const result = await db.collection('user').insertOne(userObject)
    return result
  }
}

module.exports = AuthDAO
