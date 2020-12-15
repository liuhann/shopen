const nodeFetch = require('node-fetch')
const { createApi } = require('unsplash-js')
const debug = require('debug')('unsplash')

/**
 * 调用 UnSplash API接口服务，缓存一些特定查询的结果(最多100个)
 * @type {UnSplashService}
 */
module.exports = class UnSplashService {
  constructor (mongodb) {
    this.mongodb = mongodb

    this.unsplash = createApi({
      accessKey: 'bOm4lBhTiEfPzQgcoNXs2Pbc88lBFiPoCZfisuJD7E0',
      fetch: nodeFetch
    })
  }

  getDb () {
    return this.mongodb.getDb('splash-cache')
  }

  initRoutes (router) {
    router.get(`/unsplash/photo/find`, async (ctx, next) => {
      const { query } = ctx.request.query
      if (!query) {
        ctx.throw(400, 'Query Required')
      }
      const photos = await this.getPhotosByQuery(query, 100)
      ctx.body = {
        query,
        photos
      }
      await next()
    })
  }

  async getPhotosByQuery (query, limit) {
    const db = await this.getDb()
    const coll = await db.collection('photo-queries')

    const photoCache = await coll.findOne({
      query
    })

    if (photoCache) {
      return photoCache.photos
    } else {
      const newPhotoCache = {
        query,
        photos: []
      }
      let currentPage = 1

      while (true) {
        debug('fetching ' + query, ' page ' + currentPage)
        const result = await this.unsplash.search.getPhotos({
          query,
          page: currentPage,
          perPage: 20
        })
        debug('fetched')
        currentPage++
        const response = result.response
        if (response.results && response.results.length) {
          for (let photo of response.results) {
            newPhotoCache.photos.push(photo.urls.raw)
          }
          if (newPhotoCache.photos.length >= limit) break
        } else {
          break
        }
      }
      await coll.insertOne(newPhotoCache)
      return newPhotoCache.photos
    }
  }
}
