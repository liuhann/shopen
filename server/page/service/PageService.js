const debug = require('debug')('core:page')

class PageService {
  constructor () {
    this.mongo = null
  }

  upsertPage (user, site, page) {
    page.user = user
    page.site = site
    const r = this.mongo.getDb().collection('page').upsert({
      _id: page._id
    }, page)
    return r
  }

  getPages (user, {skip, limit}) {

  }
}

module.exports = PageService
