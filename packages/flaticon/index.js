const FlatIconAPIClient = require('./FlatIconAPIClient.js')
const initRestService = require('../rest/init.js')
const apiKey = '0db4ed954bb9589fc6e193888a98aeee61a7e7b5'

module.exports = {
  async created (app) {
  },
  ready (app) {
    initRestService(app, 'flaticon', 'icons', '/flaticon/icon', true)
    const router = app.context.router
    const client = new FlatIconAPIClient()
    router.get('/flaticon/search', async (ctx, next) => {
      ctx.body = await client.search(apiKey, ctx.query.q, ctx.query.color || 2, ctx.query.page || 1)
      await next()
    })
  }
}
