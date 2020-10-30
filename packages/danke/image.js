const debug = require('debug')('danke:image')
const { createCanvas, loadImage } = require('canvas')

module.exports = class ImageController {
  constructor (app) {
    app.router.get(`/danke/image/merge`, async (ctx, next) => {
      const { top, bottom, width, height } = ctx.query

      debug('merging', top, bottom, width, height)
      ctx.body = await this.mergeImage(top, bottom, parseInt(width), parseInt(height))
      ctx.type = 'image/png'
      await next()
    })
  }

  async mergeImage (top, bottom, width, height) {
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    try {
      const topImage = await loadImage(top)
      const bottomImage = await loadImage(bottom)

      ctx.drawImage(bottomImage, 0, 0, width, height)
      ctx.drawImage(topImage, 0, 0, width, height)

      return canvas.createPNGStream()
    } catch (e) {
      return e
    }
  }
}
