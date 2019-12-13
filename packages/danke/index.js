const initRestService = require('../rest/init.js')
module.exports = {
  async created (app) {
  },
  ready (app) {
    // 作品保存
    initRestService(app, 'danke', 'works', '/danke/work', true)
    // 多个元素块模板
    initRestService(app, 'danke', 'blocks', '/danke/block', true)
    // 动画
    initRestService(app, 'danke', 'animations', '/danke/animation')
    // 矢量遮罩
    initRestService(app, 'danke', 'vectors', '/danke/vector')
    // 音频
    initRestService(app, 'danke', 'audios', '/danke/audio')
  },
  async bootComplete (app) {
    app.context.services['blocks.rest'].ensureIndex('name', {
      overwriteOnDuplicated: true
    })
  }
}
