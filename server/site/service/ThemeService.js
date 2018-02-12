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
        const globalData = await this.page.getGlobalData();

        const data = function() {
        	return {
                global: globalData,
        		page: globalData,
	        };
        };


        //load all section components
        const sectionComponents = await this.getAllSectionComponents();
        for(let componentName in sectionComponents) {
            sectionComponents[componentName].data = data;
            Vue.component(componentName, sectionComponents[componentName]);
        }

        //load current page component
	    Vue.component('layout-content', {
	    	template: await this.loader.loadTemplate(pageSetting.path),
		    function() {
			    return {
			    	setting: pageSetting,
				    global: globalData,
				    page: globalData,
			    };
		    },
	    });

        //section renderer
        Vue.component('section-list', SectionList);

        //root options
        const rootVueOptions = {};

        //layout name
        const layout = pageSetting.layout || 'default';

        const layoutConfig = await this.loader.loadLayoutConfig(layout);
        rootVueOptions.template = await this.loader.loadLayout(layout);

        rootVueOptions.data = {
	        global: globalData,
	        page: globalData,
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