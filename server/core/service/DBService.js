const lowdb = require('lowdb');

class JsonDbService {

    constructor() {
		this.user = null;
    }

    insertOne(coll, record) {

    }

    insertMany(coll, records) {

    }

	/**
	 * creates a cursor for a query that can be used to iterate over results
	 */
	find(coll, filter, options) {

    }

    findOne(coll, filter) {

    }

    getProperty() {

    }
}


module.exports = JsonDbService;