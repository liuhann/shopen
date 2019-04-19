const RestfullDAO = require('../rest/restful-dao')
const shortid = require('shortid')
const svgCaptcha = require('svg-captcha')

/**
 User {
  id: 'mobile' or 'email' (from github),
  pwd: 'mobile needed',
  nick: 'nike name '
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
    this.captchMap = {}
  }

  initRoutes (router) {
    router.post('/api/user/register', this.register.bind(this))
    router.post('/api/user/login', this.login.bind(this))
    router.get('/api/user/current', this.getCurrentUser.bind(this))
    router.get('/api/user/sms/:phone', this.sendPhoneSmsCode.bind(this))
    router.get('/api/captcha', this.getCaptcha.bind(this))
  }

  async getCaptcha (ctx, next) {
    let captcha = svgCaptcha.create({
      background: '#eef'
    })
    this.captchMap[ctx.token] = captcha.text.toLowerCase()
    ctx.body = {
      svg: captcha.data
    }
    await next()
  }

  async login (ctx, next) {
    const { name, password, captcha } = ctx.request.body
    const result = {}
    // captcha first
    if (this.captchMap[ctx.token] !== captcha) {
      delete this.captchMap[ctx.token]
      result.code = 400
    } else {
      delete this.captchMap[ctx.token]
      const user = await this.userdao.getOne({
        id: name,
        pwd: password
      })
      if (user) {
        this.userdao.patchOne('id', {
          id: name,
          token: ctx.token
        })
        result.code = 200
        result.user = user
      } else {
        result.code = 401
        result.message = '用户名或密码错误'
      }
    }
    ctx.body = result
    await next()
  }

  async register (ctx, next) {
    const { name, password, nickname } = ctx.request.body
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
          nick: nickname,
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
    console.log(ctx.app.tokenUsers)
    ctx.body = ctx.user
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
