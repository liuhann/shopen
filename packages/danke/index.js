const initRestService = require('../rest/init.js')
module.exports = {
  async created (app) {
  },
  ready (app) {
    // 作品
    initRestService(app, 'danke', 'works', '/danke/work', true)
    // 作品模板
    initRestService(app, 'danke', 'templates', '/danke/template', true)
    // 动画
    initRestService(app, 'danke', 'animations', '/danke/animation')
    // SVG路径
    initRestService(app, 'danke', 'svgpaths', '/danke/path')
    // 资源包
    initRestService(app, 'danke', 'svgs', '/danke/svg')
    // 资源包
    initRestService(app, 'danke', 'packs', '/danke/pack').setSubCollection('images', 'pack')
    // 资源
    initRestService(app, 'danke', 'images', '/danke/image')
    // 公开资源
    initRestService(app, 'public', 'images', '/danke/public/image')
    // 过滤器组件
    initRestService(app, 'danke', 'styles', '/danke/style')
    // 音频
    initRestService(app, 'danke', 'audios', '/danke/audio')
  },
  async bootComplete (app) {
    app.context.services['works.rest'].ensureIndex('id', {
      overwriteOnDuplicated: false
    })
    app.context.services['images.rest'].setObjectIdField(['pack'])
  }
}
