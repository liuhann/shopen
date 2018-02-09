process.env.DEBUG = 'boot,site:*';

const fs        = require('fs');
const Koa       = require('koa');
const bodyparser= require('koa-bodyparser');
const Router    = require('koa-router');
const serve     = require('koa-static');
const debug     = require('debug')('boot');

class BootStrap {

    constructor() {

    }

    async start() {
        this.app = new Koa();
        this.services = {};
        //default middlewares
        this.app.use(bodyparser());

        this.app.use(serve('./static'));

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

            const moduleConfig = require( `../server/${dir}/module.js`);
            if (!moduleConfig) {
                debug(`module ${dir} in server has no module.js file`);
                continue;
            }

            debug(`initialize module [${dir}]..`);

            if (moduleConfig.services && moduleConfig.name) {
                const exposedServices = await moduleConfig.services.call(app);
                for(let serviceName in exposedServices) {
                    this.services[serviceName] = exposedServices[serviceName];
                }
            }

            if (moduleConfig.paths) {
                const paths =  await moduleConfig.paths.call(null);
                for(let path in paths) {
                    if (paths[path].get) {
                        debug(`[GET] ${path} -> ${paths[path].get.name}`);
                        router.get(path, paths[path].get);
                    }
                    if (paths[path].put) {
                        debug(`[PUT] ${path} -> ${paths[path].put.name}`);
                        router.put(path, paths[path].put);
                    }
                    if (paths[path].post) {
                        debug(`[POST] ${path} -> ${paths[path].post.name}`);
                        router.post(path, paths[path].post);
                    }
                    if (paths[path].delete) {
                        debug(`[DELETE] ${path} -> ${paths[path].delete.name}`);
                        router.put(path, paths[path].delete);
                    }
                }
            }
            if (moduleConfig.onload) {
                moduleConfig.onload.call(null, app);
            }
        }

        //do some constructor injection by service name
        for(const serviceName in this.services) {
            // service list
            let constructorDefinedRefs = Object.getOwnPropertyNames(this.services[serviceName]);

            //iterate fields of service
            for(const refName of constructorDefinedRefs) {
                // inject service by name
                if (!refName.startsWith('_')  //field start with underline is considered not to be service
                    && this.services[serviceName][refName] == null) {
                    this.services[serviceName][refName] = this.services[refName];
                }
            }
        }
        app.context.services = this.services;
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


const boot = new BootStrap();

boot.start();

