const Crypto = require('../utils/crypto')
require('../utils/hmac')
require('../utils/base64')
require('../utils/sha1')
const Base64 = require('../utils/base64')

const shortid = require('shortid')

const policyText = {
  'expiration': '2020-01-01T12:00:00.000Z', // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
  'conditions': [
    ['content-length-range', 0, 5 * 1024 * 1024] // 设置上传文件的大小限制
  ]
}

class ImageService {
  constructor ({host, accessid, accesskey}) {
    this.host = host
    this.accessid = accessid
    this.accesskey = accesskey
    this.mongo = null
    this.user = null
  }
  
  init () {
    this.policyBase64 = Base64.encode(JSON.stringify(policyText))
    const message = this.policyBase64
    const bytes = Crypto.HMAC(Crypto.SHA1, message, this.accesskey, { asBytes: true })
    this.signature = Crypto.util.bytesToBase64(bytes)
  }
  
  getPolicy () {
    return {
      'key': '1212/' + shortid.generate(),
      'policy': this.policyBase64,
      'OSSAccessKeyId': this.accessid,
      'signature': this.signature,
      'host': this.host
    }
  }
}
module.exports = ImageService
