const MongodbService = require('./mongodb')

module.exports = {
  name: 'mongo',

  async created (app) {
    app.context.services.mongodb = new MongodbService({
      url: 'mongodb://localhost:27017',
      dbName: 'shopen'
    })
  },

  async ready (app) {
    await app.context.services.mongodb.connect()
  },

  async bootComplete (app) {
  }
}
