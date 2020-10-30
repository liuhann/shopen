const initRestService = require('../rest/init.js')
const Avatar = require('./avatar')
const Image = require('./image')
module.exports = {
  name: 'danke',
  async created (app) {
  },
  ready (app) {
    // 作品
    initRestService(app, 'danke', 'works', '/danke/work', true).ensureIndex('id', {
      overwriteOnDuplicated: false
    })
    initRestService(app, 'danke', 'previews', '/danke/preview', true).ensureIndex('id', {
      overwriteOnDuplicated: true
    })
    // lost+found
    initRestService(app, 'trash', 'works', '/trash/work', true)
    // HTML组件
    initRestService(app, 'danke', 'htmls', '/danke/h5')
    // 资源
    // 过滤器组件
    initRestService(app, 'danke', 'styles', '/danke/style')
    // 音频
    initRestService(app, 'danke', 'audios', '/danke/audio')
    initRestService(app, 'danke', 'images', '/danke/image')
    // 公开资源
    initRestService(app, 'public', 'images', '/danke/public/image')
    initRestService(app, 'public', 'deleted', '/danke/public/deleted')
    initRestService(app, 'public', 'vectors', '/danke/public/vector')

    // const cc = new controller(app)
    // cc.startPuppeteer()
    app.avatarService = new Avatar(app)
    app.imageService = new Image(app)
  },
  async bootComplete (app) {

  }
}
