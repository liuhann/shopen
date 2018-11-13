const { BosClient } = require('bce-sdk-js')

const bosConfig = {
  endpoint: 'http://bj.bcebos.com',
  credentials: {
    ak: 'i29vPdGTUyjE6HD0xaKsfq6Y',
    sk: 'bHAU6NrGLVOD710kHinHMUjeeC4UVoiN'
  }
}

module.exports = class BOSService {
  constructor () {
    this.client = new BosClient(bosConfig)
  }

  uploadLocalFileToBOS (bucket, objectKey, localFile) {
    this.client.putObjectFromFile(bucket, objectKey, localFile)
  }
}
