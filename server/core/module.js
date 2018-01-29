const UserService = require('./service/UserService');
const DBService = require('./service/DBService');


const CoreController  = require('./controller/CoreController');

module.exports = {
    name: 'core',

    async services() {
        return {
            user: new UserService(this),
            db: new DBService(this)
        }
    },

    async paths() {
        return {
            '/admin/user/property': {
                'get': CoreController.getUserProperty,
                'put': CoreController.setUserProperty
            }
        }
    }


};