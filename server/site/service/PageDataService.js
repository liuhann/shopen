

class PageDataService {

    constructor() {
        this.assert = null;
        this.product = null;
        this.siteMenu = null;
    }

    async getGlobalData() {
        const menus = await this.siteMenu.getMenus();
        const products = await this.product.getProducts();
        return {
            menus,
            products
        }

    }

    async getPageData(page, params) {
        const global = await this.getGlobalData();
        const pageData = {};

        if (page === 'product') {
            this.assert.equal(params.length, 1, 401, '请输入商品ID');
            const productId = params[0];
            const product = await this.product.getProductByName(productId);
            pageData.product = product;
        }

        return Object.assign(global, pageData);

    }
}


module.exports = PageDataService;