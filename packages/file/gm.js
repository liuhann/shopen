const gm = require('gm').subClass({imageMagick: true})
const debug = require('debug')('shopen:file:gm')

class GmService {
  static async generateThumbnail (path, transform) {
    const [x, y] = transform.split(',')
    return new Promise((resolve, reject) => {
      debug('write to  ' + path + '_' + transform)
      gm(path).resize(parseInt(x), parseInt(y)).write(path + '_' + transform, function (err) {
        debug('write complete')
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

module.exports = GmService
