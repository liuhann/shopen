const urllib = require('urllib')
const debug = require('debug')('shopen:flaticon')
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
    const searchResponse = await urllib.request('https://api.flaticon.com/v2/search/icons?q=' + query, {
      dataType: 'json',
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    })
    return searchResponse.data.data
  }

  async getToken (apiKey) {
    const response = await urllib.request('https://api.flaticon.com/v2/app/authentication', {
      method: 'POST',
      dataType: 'json',
      data: {
        apikey: apiKey
      }
    })
    return response.data.data.token
  }
}
