const StoryService = require('./service')
const StoryDAO = require('./dao')
const koaRange = require('koa-range')
const RestFulController = require('../rest/restful-controller.js')
module.exports = {
  async created (app) {
  },

  ready (app) {
    const router = app.context.router
    const storyDao = new StoryDAO(app.context.services.mongodb)
    const storySevice = new StoryService(storyDao)

    const albumctl = new RestFulController(router, app.context.services.mongodb, 'ybstory', 'albums')

    // Init routing, Route Controller is required some times
    router.get('/story/home', storySevice.listHome.bind(storySevice))
    router.get('/story/related/:id', storySevice.getStoryRelated.bind(storySevice))
    router.get('/story/admin/list', storySevice.listStory.bind(storySevice))
    router.get('/story/cover/:x/:y/:cover', async (ctx, next) => {
      await app.context.services.story.storyImage(ctx, next)
    })
    router.get('/story/samples', async (ctx, next) => {
      await app.context.services.story.sampleStories(ctx, next)
    }, async (ctx, next) => {
      await next()
      ctx.services.visitdao.insertVisit('sample', ctx.request.ip, ctx.request.header['user-agent'])
    })
    router.get('/story/mp3/:id', koaRange, storySevice.storyDownload.bind(storySevice))

    router.put('/story/mark/:id/:mark', storySevice.markStory.bind(storySevice))
    router.get('/story/detail/:id', storySevice.getStoryDetail.bind(storySevice))
    router.get('/story/delete/one', storySevice.deleteStory.bind(storySevice))
    router.get('/story/delete/mark/:id', storySevice.markDelete.bind(storySevice))
    router.post('/story/update', storySevice.updateStory.bind(storySevice))
    router.get('/story/search', storySevice.searchStories.bind(storySevice))
    router.get('/story/search/path', storySevice.searchStoryInPath.bind(storySevice))
    router.get('/story/random', storySevice.randomStory.bind(storySevice))
    router.get('/story/labels', storySevice.getLabels.bind(storySevice))
    router.post('/story/props/:id', storySevice.updateStoryProps.bind(storySevice))
  }
}
