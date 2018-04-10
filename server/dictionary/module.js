const DictionaryService = require('./service/dictionary')
const dictionaryController = require('./controller/dictionary')

module.exports = {
  name: 'dictionary',
  async services () {
    return {
      'dictionary': new DictionaryService()
    }
  },
  async routes (router) {
    router.put('/api/dictionary/:namespace/:dict', dictionaryController.create)
    router.get('/api/dictionary/:namespace', dictionaryController.list)
  }
}
