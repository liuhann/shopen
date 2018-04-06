const config = require('../config')

process.env.DEBUG = config.debug

const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
const debug = require('debug')('boot')

class BootStrap {
  async start () {
    this.app = new Koa()
    this.app.config = config
    
    this.services = {}

    const router = new Router()

    // load server modules
    await this.loadModules(this.app, router)

    // use module routes
    this.app.use(router.routes())

    // active http
    this.app.listen(config.port)
  }

  /**
 * Load all modules in directory ./modules
 * @param {Application} app
 * @param {Router} router
 * @returns {Promise<void>}
 */
  async loadModules (app, router) {
    const moduleDirs = fs.readdirSync('./server')
    // loop for each module
    for (let dir of moduleDirs) {
      // find module define js
      const moduleDef = `./server/${dir}/module.js`
      // return is not defined
      if (!fs.existsSync(moduleDef)) continue

      const moduleConfig = require(`../server/${dir}/module.js`)

      debug(`initialize module [${dir}]..`)

      if (moduleConfig.services && moduleConfig.name) {
        const exposedServices = await moduleConfig.services.call(null, app)
        for (let serviceName in exposedServices) {
          this.services[serviceName] = exposedServices[serviceName]
        }
      }

      moduleConfig.routes && moduleConfig.routes(router)
      moduleConfig.onload && moduleConfig.onload(app)
    }

    // do some constructor injection by service name
    for (const serviceName in this.services) {
      // service list
      let constructorDefinedRefs = Object.getOwnPropertyNames(this.services[serviceName])

      // iterate fields of service
      for (const refName of constructorDefinedRefs) {
        // inject service by name
        if (!refName.startsWith('_') && // field start with underline is considered not to be service
                this.services[serviceName][refName] == null) {
          this.services[serviceName][refName] = this.services[refName]
        }
      }
    }

    for (const serviceName in this.services) {
      this.services[serviceName].init && this.services[serviceName].init()
    }

    app.context.services = this.services
  }
}

const boot = new BootStrap()

boot.start()
