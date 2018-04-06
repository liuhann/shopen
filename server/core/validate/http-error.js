module.exports = class HttpError extends Error {
  constructor (code, errors) {
    super('http code error: ' + code)

    this.code = code
    this.errors = errors
  }
}
