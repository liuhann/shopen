const UserService       = require('./service/UserService');
const DBService         = require('./service/DBService');
const ProductService    = require('./service/ProductSerivce');
const AssertService     = require('./service/AssertService');

const CoreController  = require('./controller/CoreController');

module.exports = {
    name: 'core',

    async services() {
        return {
            assert: new AssertService(),
            user: new UserService(),
            db: new DBService(),
            product: new ProductService(),
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