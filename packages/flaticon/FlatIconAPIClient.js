const urllib = require('urllib')
const debug = require('debug')('shopen:flaticon')
module.exports = class FlatIconAPIClient {
  constructor () {
    this.token = null
  }
  /**
  * 按照apikey 查找图标，注意的是首先获取token 如果失效会重新获取
  */
  async search (apiKey, query, color, page) {
    if (!this.token) {
      this.token = await this.getToken(apiKey)
    }
    debug('query:' + query)
    try {
      const searchResponse = await urllib.request('https://api.flaticon.com/v2/search/icons?q=' + query + '&color=' + color + '&page=' + page, {
        dataType: 'json',
        timeout: 60000, // 超时60s
        headers: {
          'Authorization': 'Bearer ' + this.token
        }
      })
      debug(searchResponse.data.data.length)
      return searchResponse.data.data
    } catch (e) {
      debug(e)
      this.token = null
      return []
    }
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
