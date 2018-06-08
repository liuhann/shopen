const FileService = require('./service')

module.exports = {
  name: 'file',

  created (app) {
    app.context.services.fileUpload = new FileService(`/data/file`)
  },
  
  ready (app) {
    const router = app.context.router
    router.post('/file/upload', async (ctx, next) => {
      const fileResult = await ctx.services.fileUpload.receive(ctx)
      ctx.body = fileResult
      await next()
    })
    
    router.get('/file/download/:path*', async (ctx) => {
      if (ctx.params.path) {
        await ctx.services.fileUpload.serve(ctx, ctx.params.path)
      }
    })

    router.get('/file/thumbnail/:path*', async (ctx) => {
      await ctx.services.fileUpload.thumbnail(ctx, ctx.params.path)
    })
  }
}
