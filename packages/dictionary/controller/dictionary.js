
async function create (ctx, next) {
  const user = await ctx.services.user.getUserId()
  const {namespace, dict} = ctx.params
  const opts = ctx.request.body
  
  const result = await ctx.services.dictionary.create(user, namespace, dict, opts)
  
  ctx.body = result
  await next()
}

async function list (ctx, next) {
  const user = await ctx.services.user.getUserId()
  const {namespace} = ctx.params
  const result = await ctx.services.dictionary.list(user, namespace)
  
  ctx.body = result
  await next()
}

module.exports = {
  create,
  list
}
