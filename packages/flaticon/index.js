const FlatIconAPIClient = require('./FlatIconAPIClient.js')
const apiKey = '0db4ed954bb9589fc6e193888a98aeee61a7e7b5'

module.exports = {
  async created (app) {
  },
  ready (app) {
    const router = app.context.router
    const client = new FlatIconAPIClient()
    router.get('/flaticon/search', async (ctx, next) => {
      ctx.body = client.search (apiKey)
      await next()
    })
  }
}