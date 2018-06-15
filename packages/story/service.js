const homeLabels = require('./common/home-labels')
const fs = require('fs')
const debug = require('debug')('shopen:story:service')

const CDN_IMG = 'http://imagek.cdn.bcebos.com'

module.exports = class StoryService {
  constructor (home) {
    this.coverHome = home + '/cover'
    this.audioHome = home + '/audio'
    this.thumbHome = home + '/thumbnail'
    this.mongodb = null
    this.file = null
    this.storydao = null
  }

  async storyCover (ctx, next) {
    const fileid = ctx.params.id
    if (fs.existsSync(`${this.coverHome}/${fileid}`)) {
      await this.file.serve(ctx, `${this.coverHome}/${fileid}`)
    } else {
      const [id] = fileid.split('.')
      const story = await this.storydao.getStoryById(id)
      if (story) {
        debug(`transfer story ${CDN_IMG}/${story.cover}.png@w_420,q_80 -> ${this.coverHome}/${fileid}`)
        await this.file.transfer(`${CDN_IMG}/${story.cover}.png@w_420,q_80`, `${this.coverHome}/${fileid}`)
        await this.file.serve(ctx, `${this.coverHome}/${fileid}`)
      } else {
        debug(`story not found ${fileid}`)
      }
    }
    await next()
  }

  async storyThumbNail (ctx, next) {
    const fileid = ctx.params.id
    if (fs.existsSync(`${this.thumbHome}/${fileid}`)) {
      await this.file.serve(ctx, `${this.thumbHome}/${fileid}`)
    } else {
      const [id] = fileid.split('.')
      const story = await this.storydao.getStoryById(id)
      if (story) {
        debug(`transfer story thumbnail ${CDN_IMG}/${story.cover}.png@w_120,q_80 -> ${this.thumbHome}/${fileid}`)
        await this.file.transfer(`${CDN_IMG}/${story.cover}.png@w_120,q_80`, `${this.thumbHome}/${fileid}`)
        await this.file.serve(ctx, `${this.thumbHome}/${fileid}`)
      } else {
        debug(`story not found ${fileid}`)
      }
    }
    await next()
  }

  async storyThumbNail () {

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