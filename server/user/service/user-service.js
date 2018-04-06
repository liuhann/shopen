const debug = require('debug')('core:user')
const AuthDAO = require('../dao/auth')
const TokenDAO = require('../dao/token')
const DAOError = require('../../core/mongo/dao-error')

class UserService {
  constructor () {
    this.mongo = null
  }

  async init () {
    this.authdao = new AuthDAO(this.mongo)
    this.tokendao = new TokenDAO(this.mongo)
  }

  async checkUser (user, pwd) {
    debug(`check password ${user}/${pwd}`)
    await this.authdao.checkUser(user, pwd)
    const token = this.tokendao.generateToken(user)
    
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
