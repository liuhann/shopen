const multer = require('koa-multer')

module.exports = {
  name: 'file',

  onload (app) {

  },

  async routes (router) {
    const upload = multer({ dest: 'uploads/' })
    router.use(`/file/upload/`, upload);

    router.post(`/file/upload`, (ctx, next)=> {
    })
  },
  async services ({config}) {

  }
}
