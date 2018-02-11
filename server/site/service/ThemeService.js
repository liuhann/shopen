const Vue = require('vue');
const SectionList  = require('../vue/section-list.js');

const debug = require('debug')('site:theme');

class ThemeService {

    constructor() {
        this.db = null;
        this.loader = null;
        this.page = null;
        this._roots = null;
    }

    async getAvailableRoots() {
        if (this._roots == null) {
            this._roots = ['index', 'collection', 'page', 'product'];
        }
        return this._roots;
    }

    async render(page, paths) {
        //read page setting
        const pageSetting = await this.loader.loadPageSetting(page);

        const pageData = await this.page.getPageData(page, paths);

        //load all sections
        const sectionComponents = await this.getAllSectionComponents();
        for(let componentName in sectionComponents) {
            sectionComponents[componentName].data = function() {
                //page data is available in each component
                return pageData;
            };
            //register component
            Vue.component(componentName, sectionComponents[componentName]);
        }

        //section renderer
        Vue.component('section-list', SectionList);

        //root options
        const rootVueOptions = {};

        //layout name
        const layout = pageSetting.layout || 'default';

        const layoutConfig = await this.loader.loadLayoutConfig(layout);

        rootVueOptions.template = await this.loader.loadLayout(layout);

        //insert page into layout
        rootVueOptions.components = {
            'main-content': {
                template: await this.loader.loadTemplate(pageSetting.path),
                data: function() {
                    return Object.assign({
                        setting: pageSetting
                    }, pageData);
                }
            }
        };
       /**
        * 设置根模板的数据
        const singletonSectionsData = {};
        const settings = await themeService.getSectionSettings();
        for(const setting of settings) {
            if (setting.singleton) {
                singletonSectionsData[camelize(setting.component)] = setting.data;
            }
        }*/
        rootVueOptions.data = {
            pageData: pageData,
            setting: layoutConfig
        };
        //渲染
        const renderer = require('vue-server-renderer').createRenderer();
        const rendered = await renderer.renderToString(new Vue(rootVueOptions));
        return rendered;
    }


	/**
	 * get vue components which can render in the page.
	 * @returns {Promise<{}>}
	 */
	async getAllSectionComponents() {
		//all section config
        const sections = await this.loader.getAllSections();
        const components = {};
        for(const section of sections) {
        	//load template
            const sectionTemplate = await this.loader.getSectionTemplate(section);
	        const vueOptions = {
		        props: {
			        setting: {
				        type: Object,
			        }
		        },
		        template: sectionTemplate,
	        };
            components[section.component] = vueOptions;
        }
        return components;
    }

}

module.exports = ThemeService;