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
    // 未注册用户的作品
    initRestService(app, 'anonymous', 'works', '/danke/anonymous/work', true).ensureIndex('id', {
      overwriteOnDuplicated: false
    })
    initRestService(app, 'danke', 'previews', '/danke/preview', true).ensureIndex('id', {
      overwriteOnDuplicated: true
    })
    // lost+found
    initRestService(app, 'trash', 'works', '/trash/work', true)
    // 音频
    initRestService(app, 'danke', 'audios', '/danke/audio')
    // 字体
    initRestService(app, 'danke', 'fonts', '/danke/font')

    // 公开资源
    initRestService(app, 'public', 'images', '/danke/public/image')
    initRestService(app, 'public', 'deleted', '/danke/public/deleted')

    // 资源包 （包括vector和photo）
    initRestService(app, 'public', 'packs', '/danke/pack')
    initRestService(app, 'public', 'vectors', '/danke/public/vector')

    // 个人图片
    initRestService(app, 'danke', 'images', '/danke/image')
    // 未注册用户图片
    initRestService(app, 'anonymous', 'images', '/danke/anonymous/image')
    // const cc = new controller(app)
    // cc.startPuppeteer()
    app.avatarService = new Avatar(app)
    app.imageService = new Image(app)
  },
  async bootComplete (app) {

  }
}
