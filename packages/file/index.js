const FileService = require('./service')

module.exports = {
  name: 'file',

  created (app) {
    app.context.services.fileUpload = new FileService(`d:/filestore`)
  },
  
  ready (app) {
    const router = app.context.router
    router.post('/file/upload', async (ctx, next) => {
      const fileResult = ctx.services.fileUpload.receive(ctx)
      ctx.body = fileResult
      await next()
    })
  }
}
