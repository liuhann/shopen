const makeDir = require('make-dir')
const send = require('koa-send')
const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const shortid = require('shortid')
const GMService = require('./gm')
const debug = require('debug')('shopen:file:service')

const download = require('download')

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
        path: storePath.substr(this.baseDir.length),
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
    await send(ctx, path, {
      root: this.baseDir
    })
  }

  // request is  /2018/7/1/12/sdlkjsl_100x100.png
  async thumbnail (ctx, fileUrl) {
    if (fs.existsSync(this.baseDir + fileUrl)) {
      await this.serve(ctx, fileUrl)
    } else {
      const parsed = path.parse(fileUrl)
      const [fileName, transform] = parsed.name.split('_')
      if (transform && ['.jpg', '.png'].indexOf(parsed.ext) > -1) {
        try {
          await GMService.generateThumbnail(this.baseDir + '/' + parsed.dir + '/' + fileName, parsed.ext, transform)
          await this.serve(ctx, fileUrl)
        } catch (e) {
          ctx.throw(400)
        }
      }
    }
  }

  // from https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
  fileExtension (fname) {
    return fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
  }

  async transfer (from, dest, filename) {
    let folder = dest
    let file = filename
    if (!filename) {
      const sepIndex = dest.lastIndexOf('/')
      file = dest.substring(sepIndex + 1)
      folder = dest.substring(0, sepIndex)
    }
    await download(from, folder, {
      filename: file
    })
  }

  async delete () {

  }
}

module.exports = FileService
