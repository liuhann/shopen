/*
const Crypto = require('../utils/crypto')
require('../utils/hmac')
require('../utils/base64')
require('../utils/sha1')

const Base64 = require('../utils/base64')

const accessid = 'qOqcheyFld6oyr9L'
const accesskey = '7icKekeMgToGgfXzOIyMai7mOb8rMx'
const host = 'http://shopen-test.oss-cn-beijing.aliyuncs.com'

var policyText = {
  'expiration': '2020-01-01T12:00:00.000Z', // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
  'conditions': [
    ['content-length-range', 0, 1048576000] // 设置上传文件的大小限制
  ]
}

const policyBase64 = Base64.encode(JSON.stringify(policyText))
const message = policyBase64
var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true })

const signature = Crypto.util.bytesToBase64(bytes)
*/

async function ossUploadPolicy (ctx, next) {
  ctx.body = {
    status: 200,
    data: ctx.services.image.getPolicy()
  }
  await next()
}

module.exports = {
  ossUploadPolicy
}
