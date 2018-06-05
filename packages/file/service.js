const makeDir = require('make-dir')
const fsPromises = require('fs').promises
const shortid = require('shortid')

class FileService {
  constructor (baseDir) {
    this.baseDir = baseDir
    this.mongodb = null
  }
  
  async receive (ctx) {
    const body = ctx.request.body
    const date = new Date()
    const fileDir = `${this.baseDir}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${date.getHours()}`
    // create file store dir
    await makeDir(fileDir)
    
    const result = []
    
    for (const fileName in body.files) {
      debugger
      const uploadFile = body.files[fileName]
      const storePath = `${fileDir}/${shortid.generate()}`
      await fsPromises.rename(uploadFile.path, storePath)
      const fileDoc = {
        path: storePath,
        name: uploadFile.name,
        size: uploadFile.size
      }
      await this.mongodb.getDb().getCollection('files').insert(fileDoc)
      result.push(fileDoc)
    }
    return result
  }
  
  deleteFile () {
  
  }
}

module.exports = FileService
