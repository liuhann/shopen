module.exports = class StoryService {
  constructor () {
    this.mongodb = null
  }

  async listHome (labels) {
    const db = await this.mongodb.getDb('story')
    const colStories = db.collection('stories')
    this.homeListing = {
      list: []
    }
    this.homeListing.homesAlbum = db.collection('albums').find({
      'home': 'true'
    }).toArray()

    for (var i = 0; i < labels.length; i++) {
      let labelList = await colStories.find({
        label: labels[i]
      }).sort({
        'u': -1
      }).limit(6).toArray()

      this.homeListing.list.push({
        label: labels[i],
        list: labelList
      })
    }
    return this.homeListing
  }
}