const debug = require('debug')('core:user')
const AuthDAO = require('../dao/auth')
const TokenDAO = require('../dao/token')

class UserService {
  constructor () {
    this.mongo = null
  }

  async init () {
    this.authdao = new AuthDAO(this.mongo)
    this.tokendao = new TokenDAO(this.mongo)
  }

  async checkUser ({email, pwd}) {
    debug(`check password ${email}/${pwd}`)
    await this.authdao.checkUser(email, pwd)
    const token = await this.tokendao.generateToken(email)

    return {
      token
    }
  }

  async register ({name, pwd, email}) {
    const result = await this.authdao.register({name, pwd, email})
    return result
  }

  async getUserByToken (token) {

  }
}

module.exports = UserService
