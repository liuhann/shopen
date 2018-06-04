const {ObjectID} = require('mongodb')

module.exports = async function (ctx, next) {
  if (ctx.type === 'insert') {
    const object = ctx.object
    for (let key in object) {
      if (key.match(/^_[a-z]+_id$/)) {
        object[key] = new ObjectID(object[key])
      }
    }
  }
  await next()
}
