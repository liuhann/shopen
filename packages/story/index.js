const StoryService = require('./service')

module.exports = {
  async created (app) {
    // service register
    app.context.services.story = new StoryService()
  },

  ready (app) {
    const router = app.context.router
    // Init routing, Route Controller is required some times
    router.get('/story/home', async (ctx, next) => {
      const body = await ctx.services.story.listHome(ctx.query.labels.split(','))
      ctx.body = body
      await next()
    })
  }

}
