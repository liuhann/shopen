const RestfullDAO = require('../rest/restful-dao')
const shortid = require('shortid')

/**
 User {
  id: 'mobile' or 'email' (from github),
  pwd: 'mobile needed',
  ip: '',
  logined: time,
  token: '',
  avatar: ''
 }
 * @type {module.UserController}
 */

module.exports = class UserController {
  constructor (ctx) {
    this.userdao = new RestfullDAO(ctx.services.mongodb, 'danke', 'user')
  }
  initRoutes (router) {
    router.use('/api/user', this.setUserMiddleWare.bind(this))
    router.post('api/user/register', this.register.bind(this))
    router.post('/api/user/login', this.login.bind(this))
    router.get('/api/user/current', this.getCurrentUser.bind(this))
    router.get('/api/user/sms/:phone', this.sendPhoneSmsCode.bind(this))
  }

  async login (ctx, next) {
    const { name, password } = ctx.request.body
    const result = {}
    if (/^[1][3,4,5,7,8][0-9]{9}$/.test(name)) {
      const user = await this.userdao.getOne({
        id: name,
        pwd: password
      })
      if (user) {

      } else {
        result.code = 401
      }
      this.tokenUsers[ctx.query.token] = phone
      result.token = ctx.query.token
      result.phone = phone
      result.ok = '1'
    } else {
      result.code = 400
    }
    ctx.body = result
    await next()
  }

  async register (ctx, next) {
    const { name, password } = ctx.request.body
    const result = {}
    if (/^[1][3,4,5,7,8][0-9]{9}$/.test(name)) {
      const user = await this.userdao.getOne({
        id: name
      })
      if (user) {
        result.code = 409
      } else {
        const token = shortid()
        await this.userdao.insertOne({
          id: name,
          pwd: password,
          ip: this.getRemoteIp(ctx.req),
          logined: new Date().getTime(),
          token: token,
          avatar: ''
        })
        result.token = token
        result.code = 200
      }
    } else {
      result.code = 400
    }
    ctx.body = result
    await next()
  }

  getRemoteIp (req) {
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
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
