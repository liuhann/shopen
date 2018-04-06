const descriptor = {
  email: {type: 'email', required: true, message: '请填写正确的邮件地址'},
  name: {type: 'string', required: true, message: '请输入姓名'},
  pwd: {type: 'string', required: true, min: 6, message: '请至少输入6位密码'}
}

async function register (ctx, next) {
  const validator = new ctx.Schema(descriptor)
  await validator.validated(ctx.request.body)
  await ctx.services.user.register(ctx.request.body)
  ctx.body = {
    status: 200
  }
  await next()
}

async function login (ctx, next) {
  const validator = new ctx.Schema(descriptor)
  await validator.validated(ctx.request.body)
  const result = await ctx.services.user.checkUser(ctx.request.body)
  ctx.body = {
    status: 200,
    data: result
  }
}

module.exports = {
  register,
  login
}
