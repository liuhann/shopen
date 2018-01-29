const jsonfile = require('jsonfile');

export default class PageDataService {

    template: string;
    key: string;
    query_string: any;

    constructor(template: string, key: string, query_string:any) {
        this.template = template;
        this.key = key;
        this.query_string = query_string;
    }

    replaceTitle(title:string):string {
        return title.replace(/[\s/\(\)（）.]+/g, '-').toLowerCase();
    }

    async getMenus(): Promise<any> {
        /*const file = `./themes/default/config/menus.json`;
        const menus = jsonfile.readFileSync(file);
        return menus;
        */
        return [];
    }

    async getGlobalData(): Promise<any> {
        const all_products = await this.getAllProducts();
        all_products["empty"] = {
            title: 'Your product\'s name',
            price: '19.00',
            compare_price: '29.00',
            vendor: 'XBN',
            sku: 'annex-1',
            cover: 'http://localhost:3000/static/assets/images/product.svg',
        };
        return {
            'site_menus': await this.getMenus(),
            'server': 'http://localhost:3000',
            all_products,
        };
    }

    async getPageData(): Promise<any> {
        const global = await this.getGlobalData();
        const pagedData: any = {};
        if (this.template === 'collections' && this.key === 'frontpage') {
            pagedData.collection = await this.getCollectionProducts();
        }
        if (this.template === 'product') {
            pagedData.product = {
                title: 'Twinings Tea Bags Sampler Assortment - 40ct with By The Cup Honey Stix',
                price: '45.00',
                compare_price: '99.00',
                vendor: 'xbn',
                sku: 'annex-1',
                cover: 'http://localhost:3000/static/assets/images/shan1.jpg',
                content: 'Our Twinings Tea Bag Variety Includes 1 bag of each of the following flavors plus various flavored By The Cup Honey Stix!\n' +
                'Organic Breakfast Blend, Organic Earl Grey, Organic Chai, Organic Pure Green, Organic Peppermint, Organic Camomile Mint & Lemon/Organic Nightly Calm, Winter Spice Herbal, Lady Grey, Lapsang Souchong, Darjeeling,\n' +
                'Prince of Wales, English Breakfast, Earl Grey, Irish Breakfast, English Afternoon, , Green Tea, Jasmine Green, Green & Lemon, Green & Mint,\n' +
                'Pomegranate, Raspberry, & Strawberry Green, Nightly Calm Green, Pure Peppermint, Pure Camomile, Lemon & Ginger, African Rooibos, Honeybush, Mandarin, & Orange, Nightly Calm, Camomile, Honey, & Vanilla, Wild Berries\n' +
                'Orange & Cinnamon Spice, Pure White Tea, Chai, Ultra Spice Chai, Spiced Apple Chai, French Vanilla Chai, Lemon Twist, Pomegranate Delight, Mixed Berries, & Blackcurrant Breeze'
            };
        }
        return Object.assign(global, pagedData);
    }

    async getAllProducts(): Promise<any> {
        const samples = await this.getCollectionProducts();
        const result:any = {};
        for(const product of samples.products) {
            result[this.replaceTitle(product.title)] = product;
        }
        return result;
    }

    async getCollectionProducts(): Promise<any> {
        return {
            title: '',
            all_tags: [],
            products: [{
                title: 'Anne Klein Women\'s AK/1363SVSV Diamond Dial Silver-Tone Bracelet Watch',
                price: '123.00',
                compare_price: '100',
                sku: 'anne-1',
                vendor: 'xbn',
                cover: 'http://localhost:3000/static/assets/images/phone1.jpg',
                content: 'Anne Klein 1363SVSV women\'s watch features a 32mm wide and 9mm thick solid stainless steel case with a fixed bezel and textured push-pull crown. Anne Klein 1363SVSV is powered by a precise quartz movement. This beautiful watch also features a shiny sunray silver tone dial with silver tone luminous hands and diamond '
            }, {
                title: 'Twinings Tea Bags Sampler Assortment - 40ct with By The Cup Honey Stix',
                price: '45.00',
                compare_price: '99.00',
                sku: 'annex-1',
                vendor: 'xbn',
                cover: 'http://localhost:3000/static/assets/images/shan1.jpg',
                content: 'Our Twinings Tea Bag Variety Includes 1 bag of each of the following flavors plus various flavored By The Cup Honey Stix!\n' +
                'Organic Breakfast Blend, Organic Earl Grey, Organic Chai, Organic Pure Green, Organic Peppermint, Organic Camomile Mint & Lemon/Organic Nightly Calm, Winter Spice Herbal, Lady Grey, Lapsang Souchong, Darjeeling,\n' +
                'Prince of Wales, English Breakfast, Earl Grey, Irish Breakfast, English Afternoon, , Green Tea, Jasmine Green, Green & Lemon, Green & Mint,\n' +
                'Pomegranate, Raspberry, & Strawberry Green, Nightly Calm Green, Pure Peppermint, Pure Camomile, Lemon & Ginger, African Rooibos, Honeybush, Mandarin, & Orange, Nightly Calm, Camomile, Honey, & Vanilla, Wild Berries\n' +
                'Orange & Cinnamon Spice, Pure White Tea, Chai, Ultra Spice Chai, Spiced Apple Chai, French Vanilla Chai, Lemon Twist, Pomegranate Delight, Mixed Berries, & Blackcurrant Breeze'
            }, {
                title: 'Apple MacBook Pro 13.3英寸笔记本电脑 深空灰色（2017新款Multi-Touch Bar/Core i5/8GB/256GB MPXV2CH/A）',
                price: '332.00',
                compare_price: '1012.00',
                sku: 'anne-2',
                vendor: 'xbn',
                cover: 'http://localhost:3000/static/assets/images/shan2.jpg',
                content: 'Anne Klein 1363SVSV women\'s watch features a 32mm wide and 9mm thick solid stainless steel case with a fixed bezel and textured push-pull crown. Anne Klein 1363SVSV is powered by a precise quartz movement. This beautiful watch also features a shiny sunray silver tone dial with silver tone luminous hands and diamond '
            }]
        }
    }



}