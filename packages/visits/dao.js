class VisitDAO {
  constructor () {
    this.mongodb = null
  }
  async getDb () {
    return this.mongodb.getDb('visits')
  }
  async insertVisit (name, ip, agent) {
    const db = await this.getDb()

    const now = new Date()
    db.collection('visits').insertOne({
      name,
      ip,
      agent,
      'time': now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '  ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
    })
  }
}

module.exports = VisitDAO
