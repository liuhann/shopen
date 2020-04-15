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
    // 资源包
    initRestService(app, 'danke', 'packs', '/danke/pack').setSubCollection('svgs', 'pack')
    // 收藏的资源包
    initRestService(app, 'danke', 'starpacks', '/danke/starpack').setSubCollection('svgs', 'pack')
    // 公用图片、资源
    initRestService(app, 'danke', 'vectors', '/danke/vector')
    // 可修改颜色的SVG资源
    initRestService(app, 'danke', 'svgs', '/danke/svg').setForeignKeys(['pack'])
    // clippath图片
    initRestService(app, 'danke', 'clippaths', '/danke/clippath')
    // 样式和特效集合
    initRestService(app, 'danke', 'styles', '/danke/style')
    // 用户私有的图片、资源
    initRestService(app, 'danke', 'images', '/danke/image')
    // 音频
    initRestService(app, 'danke', 'audios', '/danke/audio')
  },
  async bootComplete (app) {
    app.context.services['blocks.rest'].ensureIndex('name', {
      overwriteOnDuplicated: true
    })
    app.context.services['works.rest'].ensureIndex('id', {
      overwriteOnDuplicated: false
    })
  }
}
