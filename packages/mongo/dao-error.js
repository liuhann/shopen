module.exports = class DAOError extends Error {
  constructor (code, error) {
    super('http dao code error: ' + code)
    this.code = code
    this.error = error
  }
}
