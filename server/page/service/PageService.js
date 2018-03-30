const debug = require('debug')('core:page');

class PageService {

	constructor() {
		this.mongo = null
	}

	upsertPage(user, page) {
		page.user = user;
		const r = this.mongo.getDb().collection('page').insertOne(page);
		return r;
	}

	getPages(user, {skip, limit}) {

	}

}