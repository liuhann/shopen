const gm = require('gm').subClass({imageMagick: true})
const debug = require('debug')('shopen:file:gm')

class GmService {
  static async generateThumbnail (path, ext, transform) {
    const [x, y] = transform.split('x')
    return new Promise((resolve, reject) => {
      debug('write to  ' + path + '_' + transform + ext)
      gm(path + ext).resize(parseInt(x), parseInt(y)).write(path + '_' + transform + ext, function (err) {
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
