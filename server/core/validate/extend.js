const Schema = require('async-validator')
const HttpError = require('./http-error')

Schema.prototype.validated = async function (object) {
  return new Promise((resolve, reject) => {
    this.validate(object, function (errors, fields) {
      if (errors) {
        reject(new HttpError(400, errors))
      } else {
        resolve()
      }
    })
  })
}
module.exports = Schema
