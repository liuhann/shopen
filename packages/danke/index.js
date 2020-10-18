const initRestService = require('../rest/init.js')
const controller = require('./controller')
module.exports = {
  async created (app) {
  },
  ready (app) {
    // 作品
    initRestService(app, 'danke', 'works', '/danke/work', true).ensureIndex('id', {
      overwriteOnDuplicated: false
    })
    // lost+found
    initRestService(app, 'trash', 'works', '/trash/work', true)
    // 过滤器组件
    initRestService(app, 'danke', 'styles', '/danke/style')
    // 音频
    initRestService(app, 'danke', 'audios', '/danke/audio')// 音频
    initRestService(app, 'danke', 'htmls', '/danke/h5')
    // 资源
    initRestService(app, 'danke', 'images', '/danke/image')
    // 公开资源
    initRestService(app, 'public', 'images', '/danke/public/image')
    initRestService(app, 'public', 'deleted', '/danke/public/deleted')
    initRestService(app, 'public', 'vectors', '/danke/public/vector')

    // const cc = new controller(app)
    // cc.startPuppeteer()

  },
  async bootComplete (app) {

  }
}
