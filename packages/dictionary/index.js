const DictionaryService = require('./service/dictionary')
const dictionaryController = require('./controller/dictionary')

module.exports = {
  name: 'dictionary',

  created (app) {
    app.context.services.dictionary = new DictionaryService()
  },

  ready (app) {
    const router = app.context.router
    router.put('/api/dictionary/:namespace/:dict', dictionaryController.create)
    router.get('/api/dictionary/:namespace', dictionaryController.list)
  }
}
