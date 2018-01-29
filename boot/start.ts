import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as fs from 'fs';

const bodyParser = require('koa-bodyparser');
const send = require('koa-send');
const debug = require('debug')('shopen-core');

class BootStrap {

    config: any;

    constructor() {

    }

    async start() {
        const app = new Koa();

        app.use(bodyParser());
        app.use(this.globalMiddleWare);

        app.context.menus = [];

        const router = new Router();
        await this.loadModules(app, router);
        app.use(router.routes());

        app.listen(3000);
    }

    /**
     * Load all modules in directory ./modules
     * @param {Application} app
     * @param {Router} router
     * @returns {Promise<void>}
     */
    async loadModules(app: Koa, router: Router) {
        const moduleDirs = fs.readdirSync('./modules');
        for(let dir of moduleDirs) {
            const moduleDef = `./modules/${dir}/module.js`;
            if (!fs.existsSync(moduleDef))  continue;

            const module = await import( `../modules/${dir}/module.js`);
            const moduleConfig = module.default;

            if (!moduleConfig) continue;


            if (module.default.route) {
                module.default.route.apply(null, [router]);
            }

            if (module.default.middleware) {
                app.use(module.default.middleware);
            }

            if (module.default.static) {
                router.get(module.default.static + '/*', async function(ctx: Koa.Context, next: Function) {
                    try {
                        let filePath = ctx.path.substring(module.default.static.length);
                        if (filePath === '/') {
                            filePath = '/index.html';
                        }
                        await send(ctx, filePath, {
                            root: `./modules/${dir}/dist`
                        });
                    } catch (err) {
                        debug(err);
                        if (err.status !== 404) {
                            throw err;
                        }
                    }
                    await next();
                })
            }

            if (moduleConfig.onload) {
                moduleConfig.onload.call(null, app);
            }
        }
    }

    /**
     * Attach global services to Application Context
     * @param {Application.Context} ctx
     * @param {Function} next
     */
    async globalMiddleWare(ctx: Koa.Context, next: Function) {
        ctx.sendResponse = function(data: any) {
            ctx.body = {
                statusCode: '2000000',
                response: data
            }
        };
        await next();
    }
}

const boot = new BootStrap();

boot.start();

