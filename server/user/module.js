const UserService = require('./service/user-service')
const userController = require('./controller/uc-controller')

module.exports = {
  name: 'uc',
  async services () {
    return {
      'user': new UserService()
    }
  },
  async routes (router) {
    router.post('/open/user/register', userController.register)
    router.post('/open/user/login', userController.login)
  }
}
