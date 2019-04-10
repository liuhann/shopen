const vhost = require('koa-virtual-host')
const Koa = require('koa')
const serve = require('koa-static')

module.exports = {
  name: 'vhost',
  async created (app) {
    // map  packages/story/dist -> m.yuanbaogushi.com'
    const staticApp = new Koa()
    staticApp.use(serve('public/frame-editor', {maxage: 30 * 24 * 60 * 60 * 1000}))
    app.use(vhost('animation.danke.fun', staticApp))
  },

  ready (app) {
  }
}
