const config = require('../config')

process.env.DEBUG = config.debug

const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
const debug = require('debug')('shopen:server')

class BootStrap {
  async start () {
    this.app = new Koa()
    this.app.globalConfig = config

    this.services = {}

    const router = new Router()

    // load server modules
    await this.loadModules(this.app, router)
  
    this.app.context.services = this.services

    // use module routes
    this.app.use(router.routes())

    // active http
    this.app.listen(config.port)
  
    debug('√ boot complete')
  }

  /**
 * Load all modules in directory ./modules
 * @param {Application} app
 * @param {Router} router
 * @returns {Promise<void>}
 */
  async loadModules (app, router) {
    const moduleDirs = fs.readdirSync('./server')
    
    this.modules = []
    // loop for each module
    for (let dir of moduleDirs) {
      // find module define js
      const moduleDef = `./server/${dir}/module.js`
      // return is not defined
      if (!fs.existsSync(moduleDef)) continue

      const moduleConfig = require(`../server/${dir}/module.js`)

      debug(`initialize module [${dir}]..`)
      
      // call service constructor and register to services
      if (moduleConfig.services && moduleConfig.name) {
        const exposedServices = await moduleConfig.services.call(null, app)
        for (let serviceName in exposedServices) {
          this.services[serviceName] = exposedServices[serviceName]
        }
      }
      this.modules.push(moduleConfig)
      // apply routes
      moduleConfig.routes && await moduleConfig.routes(router)
    }

    // fulfill service dependencies
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
    
    for (const module of this.modules) {
      module.onload && await module.onload.call(this, app, router, this.services)
    }
  }
}

const boot = new BootStrap()

boot.start()
