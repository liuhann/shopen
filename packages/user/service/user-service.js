const urllib = require('urllib')
const debug = require('debug')('core:user')
const AuthDAO = require('../dao/auth')
const HttpError = require('http-errors')

class UserService {
  async init (mongo) {
    this.authdao = new AuthDAO(mongo)
  }

  async checkUser ({email, pwd}) {
    debug(`check password ${email}/${pwd}`)
    const checked = this.authdao.checkUser(email, pwd)
    if (!checked) {
      throw new HttpError(400)
    }
    const token = await this.tokendao.generateToken(email)
    return {
      token
    }
  }

  async register ({name, pwd, email}) {
    const result = await this.authdao.register({name, pwd, email})
    if (result === -1) {
      throw new HttpError(400)
    }
    return result
  }

  async getUserByToken (token) {

  }
  async getUserId () {
    return 'test'
  }
}

module.exports = UserService
