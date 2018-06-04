const randomize = require('randomatic')
const expiresMill = 7 * 24 * 60 * 60 * 1000

class TokenDAO {
  constructor (mongo) {
    this.mongo = mongo
  }

  async generateToken (email) {
    const token = randomize('Aa0', 24)

    const db = await this.mongo.getDb()
    await db.collection('token').insertOne({
      token,
      email,
      expires: expiresMill
    })
    return token
  }

  async checkToken (token) {
    const db = await this.mongo.getDb()
    const found = await db.collection('token').findOne({
      token
    })
    if (!found) {
      return -1
    }
    return found
  }
}

module.exports = TokenDAO
