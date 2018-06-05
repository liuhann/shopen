const FileService = require('./service')

module.exports = {
  name: 'file',

  created (app) {
    app.context.services.fileUpload = new FileService()
  },
  
  ready (app) {
    const router = app.context.router
    router.post('/file/upload', async (ctx, next) => {
      ctx.services.fileUpload.receive(ctx)
      await next()
    })
  }
}
