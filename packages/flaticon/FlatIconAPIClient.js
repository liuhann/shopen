const urllib = require('urllib')
module.exports = class FlatIconAPIClient {
  constructor () {
    this.token = null
  }
  /**
  * 按照apikey 查找图标，注意的是首先获取token 如果失效会重新获取
  */
  async search (apiKey, query) {
    if (!this.token) {
      this.token = await this.getToken(apiKey)
    }
    return this.token
  }

  async getToken (apiKey) {
    const response = await urllib.request('https://api.flaticon.com/v2/app/authentication', {
      method: 'POST',
      data: {
        apikey: apiKey
      }
    })
    console.log('response got', JSON.stringify(response.data))
    console.log('token', response.data.data.token)
    return response.data.data.token
  }
}