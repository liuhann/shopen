const debug = require('debug')('danke:avatar')
const EventEmitter = require('events')

module.exports = class AvatarController extends EventEmitter {
  constructor (app) {
    super()
    this.followRestService = app.context.services['danke.follows.rest']
    this.queue = []
    this.updated = 0
    app.router.get(`/danke/avatar/download`, async (ctx, next) => {
      const workId = ctx.query.id
      ctx.body = {
        url: await this.getAvatarUrl(workId)
      }
    })

    app.router.get(`/danke/avatar/ready`, async (ctx, next) => {
      const { snapshot, id } = ctx.query
      debug('patched follow', snapshot, id)
      await this.followRestService.patch(id, {
        snapshot: snapshot
      })
      debug('patched follow', snapshot, id)
      this.emit('ready-' + id, snapshot)
      ctx.body = 'ok'
      await next()
    })
    app.router.get('/danke/avatar/queue', async (ctx, next) => {
      if (this.queue.length) {
        ctx.body = {
          follow: this.queue.shift()
        }
        debug('queue shift', ctx.body)
      } else {
        ctx.body = {}
      }
      this.updated = new Date().getTime()
      await next()
    })
  }

  async getAvatarUrl (id) {
    const work = await this.followRestService.getOne(id)
    if (work.snapshot) {
      return work.snapshot
    } else {
      if (!this.queue.includes(id)) {
        debug('queue', id)
        this.queue.push(id)
      }
      return this.waitForSnapshot(id)
    }
  }

  async waitForSnapshot (id) {
    debug('wait for snapshot', id)
    return new Promise(resolve => {
      this.once('ready-' + id, async snapshot => {
        debug('ready ', snapshot)
        resolve(snapshot)
      })
    })
  }
}
