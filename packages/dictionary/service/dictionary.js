const DictionaryDAO = require('../dao/dictionary')

class DictionaryService {
  constructor () {
    this.mongo = null
    this.user = null
  }
  
  async init () {
    this.dictdao = new DictionaryDAO(this.mongo)
  }
  
  async create (user, namespace, key, opts) {
    return this.dictdao.addDictionary(user, namespace, key, opts)
  }
  
  async list (user, namespace) {
    return this.dictdao.getDictionaryKeys(user, namespace)
  }
  
  async delete (user, namespace, key) {
  
  }
}

module.exports = DictionaryService
