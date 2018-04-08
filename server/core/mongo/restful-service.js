const RESTFullDAO = require('./restful-dao')

class RESTFulService {
  constructor (db, collName, opts) {
    this.db = db
    this.collName = collName
    this.opts = opts
  }
  getList ({skip}) {
  
  }
}

module.exports = RESTFulService
