const bson = require('bson')

class StoryDAO {
  constructor (mongodb) {
    this.mongodb = mongodb
  }

  async ensureIndex () {
    const db = await this.getStoryDb()
    db.collection('stories').createIndex({
      'title': 'text'
    })
    db.collection('stories').createIndex('deleted')
  }

  async filterAll (filter) {
    const db = await this.getStoryDb()
    const cursor = await db.collection('stories').find(filter).limit(5000)
    const result = await cursor.toArray()
    return result
  }

  async updateByFilter (filter, update) {
    const db = await this.getStoryDb()
    const cursor = await db.collection('stories').find(filter).limit(5000)
    while (cursor.hasNext()) {
      let doc = await cursor.next()
      await db.collection('stories').findOneAndUpdate({
        '_id': doc._id
      }, {
        $set: update
      })
    }
  }

  async searchStoryInSamePath (query) {
    const db = await this.getStoryDb()
    const cursor = await db.collection('stories').find({
      path: {
        $regex: query
      }
    })
    const result = await cursor.toArray()
    return result
  }

  async searchStoryTitleContains (query, skip, limit) {
    const db = await this.getStoryDb()
    const cursor = await db.collection('stories').find({
      title: {
        $regex: query
      }
    }).skip(skip).limit(limit)
    const result = await cursor.toArray()
    return result
  }

  async getTopAlbums () {
    const db = await this.getStoryDb()
    return db.collection('albums').find({
      'home': 'true'
    }).toArray()
  }

  async listStory (skip, limit) {
    const db = await this.getStoryDb()
    const cursor = await db.collection('stories').find({deleted: {$ne: true}}).skip(skip).limit(limit)
    const list = await cursor.toArray()

    const total = await db.collection('stories').find({
      deleted: {
        $ne: true
      }
    }).count()
    return {
      list,
      total
    }
  }

  async listStoryByLabel (label, skip, limit) {
    const db = await this.getStoryDb()
    const cursor = await db.collection('stories').find({label})
    const total = await cursor.count()
    const list = await cursor.skip(skip).limit(limit).toArray()
    return {
      list,
      total
    }
  }

  async listStoryByTeller (teller, skip, limit) {
    const db = await this.getStoryDb()
    const cursor = await db.collection('stories').find({teller})
    const total = await cursor.count()
    const list = await cursor.skip(skip).limit(limit).toArray()
    return {
      list,
      total
    }
  }

  async listStoryByAlbum (album, skip, limit) {
    const db = await this.getStoryDb()
    const cursor = await db.collection('stories').find({album})
    const total = await cursor.count()
    const list = await cursor.skip(skip).limit(limit).toArray()
    return {
      list,
      total
    }
  }

  async sampleDocs (query) {
    const db = await this.getStoryDb()
    const aggregates = []

    if (query) {
      aggregates.push({
        $match: {
          desc: {
            $regex: query
          }
        }
      })
    }
    aggregates.push({
      $sample: {
        size: 6
      }
    })
    const samples = await db.collection('stories').aggregate(aggregates).toArray()
    return samples
  }

  async getStoryById (id) {
    const db = await this.getStoryDb()
    const story = await db.collection('stories').findOne({
      '_id': new bson.ObjectID(id)
    })
    return story
  }

  async getOneDeletedStory () {
    const db = await this.getStoryDb()
    const story = await db.collection('stories').findOne({deleted: true})
    return story
  }

  async deleteStoryById (id) {
    const db = await this.getStoryDb()
    await db.collection('stories').deleteOne({
      '_id': new bson.ObjectID(id)
    })
  }

  async getStoryDb () {
    return this.mongodb.getDb('ybstory')
  }

  async increaseStoryMarkByName (id, markName, ip, agent) {
    const db = await this.getStoryDb()
    const incObject = {}
    incObject[markName] = 1
    await db.collection('stories').findOneAndUpdate({
      '_id': new bson.ObjectID(id)
    }, {
      $inc: incObject
    })
    const now = new Date()
    db.collection('marks').insertOne({
      'story': id,
      'mark': markName,
      ip,
      agent,
      'time': now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDay() + '  ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
    })
  }
  async updateStory (id, set) {
    const db = await this.getStoryDb()
    await db.collection('stories').findOneAndUpdate({
      '_id': new bson.ObjectID(id)
    }, {
      $set: set
    })
  }
  async upsertLabels (label) {
    const db = await this.getStoryDb()
    const found = await db.collection('labels').findOne({
      label
    })
    if (found) {
      await db.collection('labels').findOneAndUpdate({
        label
      }, {
        $inc: { count: 1 }
      })
    } else {
      db.collection('labels').insertOne({
        label,
        count: 1
      })
    }
  }
}

module.exports = StoryDAO
