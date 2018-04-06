/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g

class PageDataService {
  constructor () {
    this.assert = null
    this.product = null
    this.navigation = null
  }

  async getGlobalData () {
    const navigations = await this.navigation.getNavigations()
    const products = await this.product.getProducts()
    return {
	        navigations,
      products
    }
  }

  camelize (str) {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
  }

  /**
     * Get data for specific page
     * @param page
     * @param params
     * @returns {Promise<any & {}>}
     */
  async getPageData (page, params) {
    const pageData = {}

    if (page === 'product') {
      this.assert.equal(params.length, 1, 401, '请输入商品ID')
      const productId = camelize(params[0])
      const product = await this.product.getProductByName(productId)
      pageData.product = product
    }

    return pageData
  }
}

module.exports = PageDataService
