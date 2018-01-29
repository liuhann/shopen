import * as Koa from 'koa';
const send = require('koa-send');
const themesPath = './themes';

async function downloadAssets(ctx: Koa.Context, next: Function) {

    console.log('assets' , ctx.path.split('/').slice(2).join('/'));

    if (ctx.body != null || ctx.status !== 404) return;
    try {

        await send(ctx, ctx.path.split('/').slice(2).join('/'), {
            root: themesPath + '/default/' });
    } catch (err) {
        if (err.status !== 404) {
            throw err;
        }
    }
}

export {
    downloadAssets,
}