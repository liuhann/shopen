const randomize = require('randomatic')

class TokenDAO {
  constructor (mongo) {
    this.mongo = mongo
  }
  
  generateToken (user) {
    const token = randomize('Aa0', 24)
    
    
  }
}

module.exports = TokenDAO
