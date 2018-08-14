class CommentDAO {
  constructor () {
    this.mongodb = null
  }
  async getDb () {
    return this.mongodb.getDb('comment')
  }
}

module.exports = CommentDAO
