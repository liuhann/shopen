const debug = require('debug')('core:page');

async function upsertPage(ctx, next) {
	debugger;
	ctx.body = {
		body: ctx.request.body,
		value: '1'
	};
	await next();
}

module.exports = {
	upsertPage,
}
