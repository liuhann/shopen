const makeDir = require('make-dir')
const send = require('koa-send')
const fs = require('fs')
const fsPromises = require('fs').promises
const shortid = require('shortid')
const gm = require('gm').subClass({imageMagick: true})

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
      const uploadFile = body.files[fileName]
      const fileExt = this.fileExtension(uploadFile.name)
      const storePath = `${fileDir}/${shortid.generate()}.${fileExt}`
      await fsPromises.copyFile(uploadFile.path, storePath)
      const fileDoc = {
        path: storePath,
        name: uploadFile.name,
        size: uploadFile.size
      }
      const db = await this.mongodb.getDb()
      await db.collection('files').insert(fileDoc)
      result.push(fileDoc)
    }
    return result
  }
  
  async serve (ctx, path) {
    console.log('send file' + path)
    await send(ctx, path, {
      root: this.baseDir
    })
  }
  
  async thumbnail (ctx, path) {
    if (fs.existsSync(path)) {
      this.serve(ctx, path)
    } else {
      const paths = path.split('_')
      if (paths.length === 2 && ['jpg', 'png'].indexOf(this.fileExtension(paths[0]))) {
        try {

          return
        } catch (e) {
          console.log(e)
        }
      }
    }

  }

  // from https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
  fileExtension (fname) {
    return fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
  }
  
  async delete () {
  
  }
}

module.exports = FileService
