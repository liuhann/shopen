const homeLabels = require('./common/home-labels')
const fs = require('fs')
const debug = require('debug')('shopen:story:service')
const CDN_IMG = 'http://imagek.cdn.bcebos.com'
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
      debug(`1.transfer story ${CDN_IMG}/${coverId}.png@w_${x},h_${y},s_2,q_80 -> ${coverHome}/${cover}`)
      await this.file.transfer(`${CDN_IMG}/${coverId}.png@w_${x},h_${y},s_2,q_80`, coverHome, cover)
      await send(ctx, `/${cover}`, {
        root: coverHome
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