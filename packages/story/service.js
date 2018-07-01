const homeLabels = require('./common/home-labels')
const fs = require('fs')
const debug = require('debug')('shopen:story:service')
const CDN_IMG = 'http://imagek.cdn.bcebos.com'
const CDN_STORY = 'http://chuchu.cdn.bcebos.com'
const send = require('koa-send')

module.exports = class StoryService {
  constructor (home) {
    this.coverHome = home + '/cover'
    this.audioHome = home + '/audio'
    this.mongodb = null
    this.file = null
    this.storydao = null
  }

  async storyImage (ctx, next) {
    let {x, y, cover} = ctx.params
    let [coverId] = cover.split('.')
    const coverHome = this.coverHome + `/${x}/${y}/` + coverId.charAt(0)
    if (fs.existsSync(`${coverHome}/${cover}`)) {
      await send(ctx, `/${x}/${y}/` + coverId.charAt(0) + `/${cover}`, {
        root: this.coverHome
      })
    } else {
      debug(`1.transfer story ${CDN_STORY}/${coverId}.png@w_${x},h_${y},s_2,q_80 -> ${coverHome}/${cover}`)
      await this.file.transfer(`${CDN_IMG}/${coverId}.png@w_${x},h_${y},s_2,q_80`, coverHome, cover)
      await send(ctx, `/${cover}`, {
        root: coverHome
      })
    }
    await next()
  }

  async storyDownload (ctx, next) {
    let {id} = ctx.params
    const story = await this.storydao.getStoryById(id)
    if (story == null) {
      ctx.status = 404
      await next()
      return
    }
    let storyPath = (story.path.charAt(0) === '/') ? story.path.substring(1) : story.path
    if (fs.existsSync(this.audioHome + '/' + storyPath)) {
      await send(ctx, storyPath, {
        root: this.audioHome
      })
    } else {
      debug(`1.transfer story ${CDN_STORY}/${storyPath} -> ${this.audioHome}/${storyPath}`)
      await this.file.transfer(`${CDN_STORY}/${encodeURIComponent(storyPath)}`, `${this.audioHome}/${storyPath}`)
      await send(ctx, storyPath, {
        root: this.audioHome
      })
    }
    await next()
  }

  async sampleStories (ctx, next) {
    ctx.body = await this.storydao.sampleDocs()
    await next()
  }

  async listHome (labels) {
    const db = await this.mongodb.getDb('ybstory')
    const colStories = db.collection('stories')
    this.homeListing = {
      list: []
    }

    this.homeListing.homesAlbum = db.collection('albums').find({
      'home': 'true'
    }).toArray()
    this.homeListing.recommendLabels = homeLabels
    this.homeListing.homesAlbum = await this.storydao.getTopAlbums()

    for (var i = 0; i < labels.length; i++) {
      let labelList = await colStories.find({
        label: labels[i]
      }).sort({
        'u': -1
      }).limit(6).toArray()

      this.homeListing.list.push({
        label: labels[i],
        list: labelList
      })
    }
    return this.homeListing
  }
}