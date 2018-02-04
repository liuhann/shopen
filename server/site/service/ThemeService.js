const Vue = require('vue');
const SectionList  = require('../vue/section-list.js');

class ThemeService {

    constructor() {
        this.db = null;
        this.loader = null;
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

        const pageData = await ctx.services.pageData.getPageData(page, paths);

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
        const vueOptions = {};

        //layout name
        const layout = pageSetting.layout || 'default';

        const layoutConfig = await this.loader.loadLayoutConfig(layout);
        vueOptions.template = await this.loader.loadLayout(layout);

        //insert page into layout
        vueOptions.components = {
            'main-content': {
                template: await this.loader.loadTemplate(pageSetting.path),
                data: function() {
                    return Object.assign({
                        setting: pageSetting
                    }, pageData);
                }
            }
        };

        //设置根模板的数据
        const singletonSectionsData = {};
        const settings = await themeService.getSectionSettings();
        for(const setting of settings) {
            if (setting.singleton) {
                singletonSectionsData[camelize(setting.component)] = setting.data;
            }
        }

        vueOptions.data = {
            pageData: pageData,
            setting: layoutConfig
        };
        //渲染
        const renderer = require('vue-server-renderer').createRenderer();
        const rendered = await renderer.renderToString(new Vue(vueOptions));
        return rendered;
    }


    async getAllSectionComponents() {
        const sections = await this.getSectionSettings();
        const components = {};

        for(const section of sections) {
            const vueOptions = await this.getSectionComponent(section);
            components[section.component] = vueOptions;
        }
        return components;
    }

    async getSectionSettings() {
        const sections = fs.readdirSync(`${this.theme}/sections`);
        const settings = [];
        for(const file of sections) {
            if (file.endsWith('.json')) {
                settings.push(jsonfile.readFileSync(`${this.theme}/sections/${file}`));
            }
        }
        return settings;
    }

}

module.exports = ThemeService;