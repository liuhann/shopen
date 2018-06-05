const makeDir = require('make-dir')

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
    if (body.files && body.files.length) {
    
    }
    debugger
  }
  
  deleteFile () {
  
  }
}

module.exports = FileService
