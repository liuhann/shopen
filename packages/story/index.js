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

    router.get('/story/cover/:id', app.context.services.story.storyCover)

    router.get('/story/thumb/:id', async (ctx, next) => {
      console.log('thj' + ctx.params.id)
      await app.context.services.story.storyThumbNail(ctx, next)
    })
  }

}
