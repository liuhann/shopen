class RESTfulDAO {
  constructor ({db, coll}, opts) {
    this.db = db
    this.coll = coll
    this.opts = opts
  }
}

module.exports = RESTfulDAO
