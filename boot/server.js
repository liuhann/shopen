const config = require('../config')

process.env.DEBUG = config.debug

const fs = require('fs')
const Koa = require('koa')
const debug = require('debug')('shopen:server')

class BootStrap {
  async start () {
    this.app = new Koa()

    this.app.context.services = {}
    this.app.context.packages = []

    await this.loadPackages()
    await this.initPackageService()

    await this.packagesReady()
    await this.bootComplete()

    // active http
    this.app.listen(config.port)
    debug('√ boot complete')
  }

  /**
   * Load all and do service injection in packages folder
   * @returns {Promise<void>}
   */
  async loadPackages() {
    const packageDir = fs.readdirSync('./packages')
    for (let dir of packageDir) {
      const shopenPackage = this.loadPackage(`./packages/${dir}`)
      if (shopenPackage) {
        this.app.context.packages.push(shopenPackage)
      }
    }
  }

  async loadPackage(modulePath) {
    const moduleDef = `./${modulePath}/index.js`
    // return is not defined
    if (!fs.existsSync(moduleDef)) {
      return null
    }
    const moduleConfig = require(`../${modulePath}/index.js`)

    debug(`prepare module [${modulePath}]..`)

    if (moduleConfig.created) {
      moduleConfig.created(this.app)
    }
    return moduleConfig
  }

  async initPackageService() {
    // fulfill service dependencies
    const services = this.app.context.services
    for (const serviceName in services) {
      // service list
      let constructorDefinedRefs = Object.getOwnPropertyNames(services[serviceName])

      // iterate fields of service
      for (const refName of constructorDefinedRefs) {
        // inject service by name
        if (!refName.startsWith('_') && // field start with underline is considered not to be service
          services[serviceName][refName] == null) {
          services[serviceName][refName] = services[refName]
        }
      }
    }
  }

  async packagesReady() {
    for (let shopenPackage of this.app.context.packages) {
      shopenPackage.ready && shopenPackage.ready(this.app)
    }
  }
  async bootComplete() {
    for (let shopenPackage of this.app.context.packages) {
      shopenPackage.bootComplete && shopenPackage.bootComplete(this.app)
    }
  }
}

const boot = new BootStrap()

boot.start()
