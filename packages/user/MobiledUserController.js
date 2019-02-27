const RestfullDAO = require('../rest/restful-dao')

module.exports = class MobiledUserController {
  constructor (ctx) {
    this.userdao = new RestfullDAO(ctx.services.mongodb, 'dankev2', 'user')
    this.tokendao = new RestfullDAO(ctx.services.mongodb, 'dankev2', 'token')
    this.tokenUsers = {}
  }
  initRoutes (router) {
    router.use('/api/user', this.setUserMiddleWare.bind(this))

    router.get('/api/user/sms/:phone', this.sendPhoneSmsCode.bind(this))
    router.post('/api/user/login', this.login.bind(this))
    router.get('/api/user/current', this.getCurrentUser.bind(this))
  }

  async login (ctx, next) {
    const { phone, smsCode } = ctx.request.body
    const result = {}
    if (/^[1][3,4,5,7,8][0-9]{9}$/.test(phone) && smsCode === '9999') {
      // login ok
      this.tokendao.insertOne({
        token: ctx.query.token,
        t: new Date().getTime(),
        phone
      })
      this.tokenUsers[ctx.query.token] = phone
      result.token = ctx.query.token
      result.phone = phone
      result.ok = '1'
    } else {
      result.fail = '1'
    }
    ctx.body = result
    await next()
  }

  async setUserMiddleWare (ctx, next) {
    const token = ctx.query.token
    if (token == null) {
      ctx.body = {
        'code': '400',
        'msg': 'token required'
      }
      await next()
    }
    if (this.tokenUsers[token] == null) {
      const tokenUser = this.tokendao.getOne({
        token
      })
      if (tokenUser == null) {
        this.tokenUsers[token] = ''
      } else {
        this.tokenUsers[token] = tokenUser.phone
      }
    }
    ctx.phone = this.tokenUsers[token]
    await next()
  }

  async getCurrentUser (ctx, next) {
    ctx.body = {
      phone: ctx.phone
    }
    await next()
  }

  async sendPhoneSmsCode (ctx, next) {
    const result = {}

    // check if user registered
    const user = await this.userdao.getOne({
      phone: ctx.params.phone
    })

    if (user === null) {
      result.code = '9999'
      // first login user need no sms code
    }
    ctx.body = result
    await next()
  }
}
