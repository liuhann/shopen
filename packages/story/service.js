const homeLabels = require('./common/home-labels')
const fs = require('fs')
const debug = require('debug')('shopen:story:service')
const CDN_IMG = 'http://imagek.cdn.bcebos.com'
const CDN_STORY = 'http://chuchu.cdn.bcebos.com'
const send = require('koa-send')
const labels = require('./story-labels')
const { BosClient } = require('bce-sdk-js')

const bosConfig = {
  endpoint: 'http://bj.bcebos.com',
  credentials: {
    ak: 'i29vPdGTUyjE6HD0xaKsfq6Y',
    sk: 'bHAU6NrGLVOD710kHinHMUjeeC4UVoiN'
  }
}

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
    ctx.storyPath = storyPath
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

  async randomStory (ctx, next) {
    ctx.body = await this.storydao.sampleDocs(ctx.query.desc)
    await next()
  }

  async searchStories (ctx, next) {
    const {query, skip, limit} = ctx.query
    const result = await this.storydao.searchStoryTitleContains(query, parseInt(skip) || 0, parseInt(limit) || 20)
    ctx.body = result
    await next()
  }

  async searchStoryInPath (ctx, next) {
    const {query} = ctx.query
    const result = await this.storydao.searchStoryInSamePath(query)
    ctx.body = result
    await next()
  }

  async autoSetCover (ctx, next) {
    let {id} = ctx.params
    const result = {}
    const story = await this.storydao.getStoryById(id)
    const sameNames = await this.storydao.searchStoryTitleContains(story.title, 0, 200)

    console.log('found ' + sameNames.length + ' story')
    if (story.copyCoverIdx === sameNames.length - 1) {
      story.copyCoverIdx = 0
    }
    for (let i = story.copyCoverIdx || 0; i < sameNames.length; i++) {
      let same = sameNames[i]
      if (same.cover && same.cover !== story.cover) {
        console.log('update cover from', same.path)
        story.cover = same.cover
        await this.storydao.updateStory(story._id, {
          cover: same.cover,
          copyCoverIdx: i
        })
        result.index = i
        break
      }
    }
    result.sameNames = sameNames
    ctx.body = result
    await next()
  }

  async updateStoryProps (ctx, next) {
    let {id} = ctx.params
    const story = await this.storydao.getStoryById(id)
    if (story) {
      await this.storydao.updateStory(story._id, ctx.request.body)
    }
    ctx.body = {}
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

  async markStory (ctx, next) {
    let {id, mark} = ctx.params
    const header = ctx.request.header
    const agent = header['user-agent']
    const ip = ctx.request.ip
    await this.storydao.increaseStoryMarkByName(id, mark, ip, agent)
    ctx.body = {
      marked: true
    }
    await next()
  }

  async listStory (ctx, next) {
    let {skip, limit} = ctx.query
    const result = await this.storydao.listStory(parseInt(skip), parseInt(limit))
    ctx.body = result
    await next()
  }

  async getStoryDetail (ctx, next) {
    let {id} = ctx.params
    const story = await this.storydao.getStoryById(id)
    ctx.body = story
    await next()
  }

  async deleteStory (ctx, next) {
    let {id} = ctx.params
    debug('removeing story : ' + id)
    const result = {}
    const story = await this.storydao.getStoryById(id)

    if (story) {
      debug('story found')
      let storyPath = (story.path.charAt(0) === '/') ? story.path.substring(1) : story.path
      if (fs.existsSync(this.audioHome + '/' + storyPath)) {
        result.mp3 = this.audioHome + '/' + storyPath
        debug('unlink mp3 file: ' + this.audioHome + '/' + storyPath)
        fs.unlink(this.audioHome + '/' + storyPath, (err) => {
          if (err) {
            console.log(err)
          } else {
            debug(`local mp3 removed ` + this.audioHome + '/' + storyPath)
          }
        })
      }
      if (story.cover) {
        let coverId = story.cover
        const coverHome = this.coverHome + `/480/480/` + coverId.charAt(0)
        debug(`remove local ${coverHome}/${coverId}.png`)
        if (fs.existsSync(`${coverHome}/${coverId}.png`)) {
          result.cover = `${coverHome}/${coverId}.png`
          fs.unlink(`${coverHome}/${coverId}.png`, (err) => {
            if (err) {
              console.log(err)
            } else {
              debug(`local image removed`)
            }
          })
        }
      }
      let client = new BosClient(bosConfig)
      try {
        debug('delete in bos chuchu', storyPath)
        await client.deleteObject('chuchu', storyPath)
        debug('bos mp3 deleted')
      } catch (e) {
        console.error(e)
      }
    }
    await this.storydao.deleteStoryById(id)
    ctx.body = result
    await next()
  }

  async deleteStoryResources (story) {

  }

  async updateStory (ctx, next) {
    const story = ctx.request.body
    const labels = story.title.match(/#[^\s]+/g)
    if (labels) {
      for (let label of labels) {
        await this.storydao.upsertLabels(label)
      }
    }
    const setProperties = {
      title: story.title,
      desc: story.desc,
      u: new Date().getTime()
    }
    await this.storydao.updateStory(story._id, setProperties)
    ctx.body = setProperties
    await next()
  }

  async getLabels (ctx, next) {
    ctx.body = labels
    await next()
  }
}
