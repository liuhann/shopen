const bodyParser = require('koa-body')
const cors = require('kcors')

module.exports = {
  name: 'core',

  created (app) {
    app.use(cors({
      credentials: true
    }))
    app.use(bodyParser())
  },

  ready (server) {

  },
  
  bootComplete (app) {
  
  }
}
