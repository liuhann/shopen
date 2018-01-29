const debug = require('debug')('core');

async function getUserProperty(ctx, next) {
    const value = await ctx.core.db.getProperty(ctx.query.key);
    ctx.body = {
        key: ctx.query.key,
        value: value
    };
    await next();
}

async function setUserProperty(ctx, next) {
    ctx.body = {
        result: 1
    };
    await next();
}

module.exports = {
    getUserProperty,
    setUserProperty
}

