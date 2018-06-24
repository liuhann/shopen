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
    // Init routing, Route Controller is required some times
    router.get('/story/home', async (ctx, next) => {
      const body = await ctx.services.story.listHome(ctx.query.labels.split(','))
      ctx.body = body
      await next()
    })

    router.get('/story/cover/:x/:y/:cover', async (ctx, next) => {
      await app.context.services.story.storyImage(ctx, next)
    })
    router.get('/story/samples', async (ctx, next) => {
      await app.context.services.story.sampleStories(ctx, next)
    })
  }

}
