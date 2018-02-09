const _ = require('lodash');

class NavigationService {

    constructor() {
        this.db = null;
    }

    getMenuTree(menuName) {

    }

    async getNavigations() {
	    const navigations = await this.db.find('navigations');
        return _.keyBy(navigations, 'name');
    }
}

module.exports = NavigationService;