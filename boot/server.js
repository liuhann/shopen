const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const serve = require('koa-static');

class BootStrap {

    constructor() {

    }

    async start() {
        this.app = new Koa();
        //default middlewares
        this.app.use(bodyParser());
        this.app.use(serve('../static'));
        this.app.use(this.globalMiddleWare);

        await this.initAppContext();

        const router = new Router();

        //load server modules
        await this.loadModules(this.app, router);

        //use module routes
        this.app.use(router.routes());

        //active http
        this.app.listen(3000);
    }

    /**
     * init global context and services
     * @returns {Promise<void>}
     */
    async initAppContext() {
        this.app.context.menus = [];
    }

    /**
     * Load all modules in directory ./modules
     * @param {Application} app
     * @param {Router} router
     * @returns {Promise<void>}
     */
    async loadModules(app, router) {
        const moduleDirs = fs.readdirSync('./server');

        //loop for each module
        for(let dir of moduleDirs) {
            //find module define js
            const moduleDef = `./server/${dir}/module.js`;

            //return is not defined
            if (!fs.existsSync(moduleDef)) continue;

            const module = await import( `../server/${dir}/module.js`);
            const moduleConfig = module.default;

            if (!moduleConfig) continue;

            if (module.default.route) {
                module.default.route.apply(null, [router]);
            }

            if (module.default.middleware) {
                app.use(module.default.middleware);
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
    async globalMiddleWare(ctx, next) {
        ctx.sendResponse = function(data) {
            ctx.body = {
                statusCode: '2000000',
                response: data
            }
        };
        await next();
    }
}
