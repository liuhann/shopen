const StoryService = require('./service')
const StoryDAO = require('./dao')

module.exports = {
  async created (app) {
    // service register
    app.context.services.story = new StoryService('/data/story')
    app.context.services.storydao = new StoryDAO()
  },

  ready (app) {
    const router = app.context.router
    app.context.services.story.dao = new StoryDAO(app.context.services.mongodb)

    // Init routing, Route Controller is required some times
    router.get('/story/home', async (ctx, next) => {
      const body = await ctx.services.story.listHome(ctx.query.labels.split(','))
      ctx.body = body
      await next()
    })

    router.get('/story/cover/:id', app.context.services.story.storyCover)
  }

}
