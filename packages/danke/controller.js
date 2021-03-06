const TransferHome = '/data/temp'
const shortid = require('shortid')
const puppeteer = require('puppeteer')
const debug = require('debug')('danke:rest')
const send = require('koa-send')

const travel = require('./templates/travel')
const lightcircle = require('./templates/lightcircle')
const joint = require('./templates/joint')
const slide = require('./templates/slide')

const Templates = {
  slide,
  travel,
  lightcircle,
  joint
}

module.exports = class DankController {
  constructor (app) {
    app.router.put(`/danke/avatar/download`, async (ctx, next) => {
      const workId = ctx.query.workId
      const filePath = await this.takeSnapShot(workId)
      await send(ctx, filePath)
    })
  }

  async startPuppeteer () {
    this.browser = await puppeteer.launch()
    this.page = await this.browser.newPage()
    this.page.setViewport({
      width: 960,
      height: 960
    })
  }

  async takeSnapShot (id) {
    await this.page.goto('http://www.dankd.fun/capture/image/' + id)
    return new Promise(resolve => {
      this.page.on('domcontentloaded', async () => {
        await this.page.screenshot({path: '/opt/data/avatar/' + id + '.png'})
        return '/opt/data/avatar/' + id + '.png'
      })
    })
  }

  async getTemplateList (ctx, next) {
    // const result = await this.templatedao.list(ctx.request.query)
    const list = []
    for (let key in Templates) {
      const template = {
        id: key,
        name: Templates[key].name,
        cover: Templates[key].cover,
        desc: Templates[key].desc
      }
      list.push(template)
    }
    ctx.body = {
      list
    }
    await next()
  }

  async getTemplate (ctx, next) {
    // const result = await this.templatedao.getOne({
    //   name: ctx.params.name
    // })
    // if (result == null) {
    //   ctx.throw(404, 'template not found')
    // }
    ctx.body = Templates[ctx.params.name]
    await next()
  }

  async addTemplate (ctx, next) {
    const result = await this.templatedao.insertOne(ctx.request.body)
    ctx.body = result
    await next()
  }

  async addWork (ctx, next) {
    const work = ctx.request.body
    work.openId = ctx.query.openId
    await this.workdao.deleteOne({
      uid: work.uid,
      openId: work.openId
    })
    debug(`work added ${work.name} ${work.isDraft} ${work.uid} ${work.openId}`)
    const result = await this.workdao.insertOne(work)
    ctx.body = {
      uid: work.uid,
      result
    }
    await next()
  }

  async shareWork (ctx, next) {
    const shares = ctx.request.body
    ctx.body = shares
    await next()
  }

  async getWork (ctx, next) {
    const result = await this.workdao.getOne({
      uid: ctx.params.uid
    })
    if (result == null) {
      ctx.body = {
        code: 404
      }
    } else {
      ctx.body = result
    }
    await next()
  }

  async deleteWork (ctx, next) {
    debug(`deleting work ${ctx.params.uid} ${ctx.query.openId}`)
    const result = await this.workdao.deleteOne({
      uid: ctx.params.uid,
      openId: ctx.query.openId
    })
    debug(`deleted work ${ctx.params.uid}`)
    ctx.body = result
    await next()
  }

  async getFeaturedList (ctx, next) {
    const result = await this.workdao.list({
      filter: {
        'featured': true
      },
      page: 1,
      count: 24
    })
    const list = []
    for (let work of result.list) {
      list.push({
        name: work.name,
        uid: work.uid,
        cover: work.cover,
        template: work.template
      })
    }
    result.list = list
    ctx.body = result
    await next()
  }

  async getMyWorkList (ctx, next) {
    const result = await this.workdao.list({
      filter: {
        openId: ctx.query.openId
      }
    })
    const list = []
    for (let work of result.list) {
      list.push({
        name: work.name,
        uid: work.uid,
        cover: work.cover,
        template: work.template,
        isDraft: work.isDraft,
        scenesCount: work.scenes.length
      })
    }
    result.list = list
    ctx.body = result
    await next()
  }

  async patchTemplate (ctx, next) {
    const result = await this.templatedao.patchOne('name', ctx.request.body)
    ctx.body = result
    await next()
  }

  async deleteTemplate (ctx, next) {
    const result = await this.templatedao.deleteOne('name', ctx.params.name)
    ctx.body = result
    await next()
  }

  async miniFileTransfer (ctx, next) {
    debug(`transfer ${ctx.query.url} ${ctx.query.workId}`)
    const uuid = ctx.query.openId + '/' + shortid.generate() + '.' + ctx.services.file.fileExtension(ctx.query.url)
    const localFile = `${TransferHome}/${uuid}`
    await ctx.services.file.transfer(ctx.query.url, localFile)
    await ctx.services.bos.uploadLocalFileToBOS('danke', uuid, localFile)

    await this.imagedao.insertOne({
      workId: ctx.query.workId,
      uuid: uuid
    })
    ctx.body = {
      url: ctx.query.url,
      uuid: uuid
    }
    await next()
  }

  async getWorkImages (ctx, next) {
    const result = await this.imagedao.list({
      filter: {
        workId: ctx.params.workId
      },
      count: 1000
    })
    ctx.body = result
    await next()
  }

  async getWeixinMe (ctx, next) {
    const one = await this.weixindao.getOne({
      openId: ctx.query.openId
    })
    if (one == null) {
      ctx.body = {
        code: 404
      }
    } else {
      ctx.body = {
        weixin: one,
        code: 200
      }
    }
    await next()
  }

  async setWeixinMe (ctx, next) {
    const one = await this.weixindao.getOne({
      openId: ctx.query.openId
    })
    if (one == null) {
      ctx.request.body.openId = ctx.query.openId
      await this.weixindao.insertOne(ctx.request.body)
    }
    ctx.body = {

    }
    await next()
  }
}
