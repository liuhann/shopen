const MongodbService    = require('./service/MongodbService');
const AssertService     = require('./service/AssertService');

const CoreController    = require('./controller/CoreController');

module.exports = {
    name: 'core',

    async services() {
        return {
            assert: new AssertService(),
            mongo: new MongodbService(),
        }
    },

	async filters() {

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