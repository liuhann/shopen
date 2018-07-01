const StoryService = require('./service')
const StoryDAO = require('./dao')
const koaRange = require('koa-range')

module.exports = {
  async created (app) {
    app.use(require('koa-static')('packages/story/dist'))
    // service register
    app.context.services.story = new StoryService('/data/story')
    app.context.services.storydao = new StoryDAO()
  },

  ready (app) {
    const router = app.context.router
    const storySevice = app.context.services.story
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
    router.get('/story/mp3/:id', koaRange, storySevice.storyDownload.bind(storySevice))
  }

}
