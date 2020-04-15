const RestfullDAO = require('../rest/restful-dao')
const shortid = require('shortid')
const svgCaptcha = require('svg-captcha')
const debug = require('debug')('shopen:user')
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
    router.post('/user/register', this.register.bind(this))
    router.post('/user/avatar', this.setAvatar.bind(this))
    router.post('/user/update', this.update.bind(this))
    router.post('/user/login', this.login.bind(this))
    router.post('/user/logout', this.logout.bind(this))
    router.get('/user/current', this.getCurrentUser.bind(this))
    router.get('/user/sms/:phone', this.sendPhoneSmsCode.bind(this))
    router.get('/captcha', this.getCaptcha.bind(this))
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

  async logout (ctx, next) {
    if (ctx.user && ctx.user.id) {
      await this.userdao.patchOne('id', {
        id: ctx.user.id,
        token: null,
        logout: new Date().getTime()
      })
      ctx.app.tokenUsers[ctx.token] = {}
      ctx.body = {
        code: 200
      }
    } else {
      ctx.body = {
        code: 401
      }
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
        debug('update user token', name, ctx.token)
        this.userdao.patchOne('id', {
          id: name,
          token: ctx.token,
          logon: new Date().getTime()
        })
        result.code = 200
        delete user.pwd
        ctx.app.tokenUsers[ctx.token] = user
        result.user = user
      } else {
        result.code = 401
        result.message = '用户名或密码错误'
      }
    }
    ctx.body = result
    await next()
  }

  async setAvatar (ctx, next) {
    const { url } = ctx.request.body
    if (ctx.user && ctx.user.id) {
      await this.userdao.patchOne('id', {
        id: ctx.user.id,
        avatar: url
      })
      ctx.app.tokenUsers[ctx.user.token] = null
      ctx.body = {
        code: 200
      }
    } else {
      ctx.body = {
        code: 401
      }
    }
    await next()
  }

  async update (ctx, next) {
    const { email, location, nick } = ctx.request.body

    if (ctx.user && ctx.user.id) {
      await this.userdao.patchOne('id', {
        id: ctx.user.id,
        email,
        location,
        nick
      })
      ctx.app.tokenUsers[ctx.user.token] = null
      ctx.body = {
        code: 200
      }
    } else {
      ctx.body = {
        code: 401
      }
    }
    await next()
  }

  async register (ctx, next) {
    const { name, password, captcha } = ctx.request.body
    const result = {}

    if (this.captchMap[ctx.token] !== captcha) {
      delete this.captchMap[ctx.token]
      result.code = 403
    } else if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(name)) {
      // 手机号码不合法
      result.code = 400
    } else {
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
          location: '',
          email: '',
          ip: this.getRemoteIp(ctx.req),
          logined: new Date().getTime(),
          token: token,
          avatar: ''
        })
        result.token = token
        result.code = 200
      }
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
