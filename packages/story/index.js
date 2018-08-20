const StoryService = require('./service')
const StoryDAO = require('./dao')
const koaRange = require('koa-range')
const vhost = require('koa-virtual-host')
const Koa = require('koa')

module.exports = {
  async created (app) {
    // map  packages/story/dist -> m.yuanbaogushi.com'
    const staticApp = new Koa()
    staticApp.use(require('koa-static')('packages/story/dist', {maxage: 30 * 24 * 60 * 60 * 1000}))
    app.use(vhost('m.yuanbaogushi.com', staticApp))
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
    router.get('/story/delete/:id', storySevice.deleteStory.bind(storySevice))
    router.post('/story/update', storySevice.updateStory.bind(storySevice))
    router.get('/story/search', storySevice.searchStories.bind(storySevice))
    router.get('/story/random', storySevice.randomStory.bind(storySevice))
    router.get('/story/labels', storySevice.getLabels.bind(storySevice))
  }
}
