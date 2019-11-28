const initRestService = require('../rest/init.js')
module.exports = {
  async created (app) {
  },
  ready (app) {
    initRestService(app, 'danke', 'works', '/danke/work', true)
    initRestService(app, 'animations', 'animations', '/danke/animation')
    initRestService(app, 'danke', 'vectors', '/danke/vector')
    initRestService(app, 'danke', 'audios', '/danke/audio')
    initRestService(app, 'danke', 'oaudios', '/danke/oaudio', true)
    initRestService(app, 'danke', 'scenetpls', '/danke/scenetpl', true)
  }
}
