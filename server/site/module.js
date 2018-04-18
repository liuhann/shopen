const RESTFulController = require('../rest/restful-controller')

module.exports = {
  name: 'site',
  
  async onload (app, router, {mongo}) {
    const db = await mongo.getDb()
    const controller = new RESTFulController('/api/v1', router, db, 'site')
    return controller
  },
  
  async services () {
    return {
    
    }
  }
}
