"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonfile = require('jsonfile');
class PageDataService {
    constructor(template, key, query_string) {
        this.template = template;
        this.key = key;
        this.query_string = query_string;
    }
    replaceTitle(title) {
        return title.replace(/[\s/\(\)（）.]+/g, '-').toLowerCase();
    }
    getMenus() {
        return __awaiter(this, void 0, void 0, function* () {
            /*const file = `./themes/default/config/menus.json`;
            const menus = jsonfile.readFileSync(file);
            return menus;
            */
            return [];
        });
    }
    getGlobalData() {
        return __awaiter(this, void 0, void 0, function* () {
            const all_products = yield this.getAllProducts();
            all_products["empty"] = {
                title: 'Your product\'s name',
                price: '19.00',
                compare_price: '29.00',
                vendor: 'XBN',
                sku: 'annex-1',
                cover: 'http://localhost:3000/static/assets/images/product.svg',
            };
            return {
                'site_menus': yield this.getMenus(),
                'server': 'http://localhost:3000',
                all_products,
            };
        });
    }
    getPageData() {
        return __awaiter(this, void 0, void 0, function* () {
            const global = yield this.getGlobalData();
            const pagedData = {};
            if (this.template === 'collections' && this.key === 'frontpage') {
                pagedData.collection = yield this.getCollectionProducts();
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
        });
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const samples = yield this.getCollectionProducts();
            const result = {};
            for (const product of samples.products) {
                result[this.replaceTitle(product.title)] = product;
            }
            return result;
        });
    }
    getCollectionProducts() {
        return __awaiter(this, void 0, void 0, function* () {
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
            };
        });
    }
}
exports.default = PageDataService;
//# sourceMappingURL=PageDataService.js.map