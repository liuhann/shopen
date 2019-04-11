const urllib = require('urllib')
const debug = require('debug')('oauth')

module.exports = {
  async created (app) {

  },

  ready (app) {
    const router = app.context.router
    router.get('/api/oauth/github', async (ctx, next) => {
      const tokenRequest = {
        client_id: '9b1eec30dbf5235a78b3',
        client_secret: '20fbd1ac865ee4b1bfa2c38c63a1a6598dab12fd',
        code: ctx.query.code
      }
      const tokenResponse = await urllib.request('https://github.com/login/oauth/access_token', {
        headers: {
          'Accept': 'application/json'
        },
        method: 'post',
        dataType: 'text',
        data: tokenRequest
      })
      console.log(tokenResponse.data)
      const token = JSON.parse(tokenResponse.data).access_token
      console.log('token', token)

      const authResponse = await urllib.request('https://api.github.com/user?access_token=' + token)
      const authInfo = JSON.parse(authResponse.data)

      console.log(authInfo)
    })
  }
}
