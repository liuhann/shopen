module.exports = async (ctx, next) => {
  const body = ctx.request.body
  if (body.public && ctx.app.config.indexOf(ctx.user.id) === -1) {
    ctx.throw(403, 'Field public should be set by administrator')
  } else {
    await next()
  }
}
