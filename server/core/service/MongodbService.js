const debug = require('debug')('core:mongo');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'shopen';

class MongodbService {
	constructor() {
		this.shopendb = this.getDb();
	}

	async getDb() {
		if (this.shopendb != null) {
			return this.shopendb;
		} else {
			let client;
			try {
				// Use connect method to connect to the Server
				client = await MongoClient.connect(url);
				this.shopendb = client.db(dbName);
				debug('mongodb connected ' + url);
				return this.shopendb;
			} catch (err) {
				debug('mongo db connect fail ' + url);
				//console.log(err.stack);
			}
			if (client) {
				client.close();
			}
		}
	}
}

module.exports = MongodbService;