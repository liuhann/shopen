const bson = require('bson')

class StoryDAO {
  constructor () {
    this.mongodb = null
  }

  async getTopAlbums () {
    const db = await this.getStoryDb()
    return db.collection('albums').find({
      'home': 'true'
    }).toArray()
  }

  async getStoryById (id) {
    const db = await this.getStoryDb()
    const story = await db.collection('stories').findOne({
      '_id': new bson.ObjectID(id)
    })
    return story
  }

  async getStoryDb () {
    return this.mongodb.getDb('ybstory')
  }
}

module.exports = StoryDAO
