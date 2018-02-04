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

        const componentData = await ctx.services.pageData.getPageData();
            //加载所有sections 包括单例模板
            const sectionComponents = await themeService.getAllSectionComponents();
            for(let componentName in sectionComponents) {
                sectionComponents[componentName].data = function() {
                    //这里设置全局的通用数据 或者来自于配置的计算数据
                    return componentData;
                };
                Vue.component(componentName, sectionComponents[componentName]);
            }
            //加载动态列表组件
            Vue.component('section-list', SectionList);

            //加载layout主入口文件
            const vueOptions = {};

            //获取对应layout文件
            const layout = pageSetting.layout || 'default';
            const layoutConfig = await themeService.loadLayoutConfig(layout);
            vueOptions.template = await themeService.loadLayout(layout);
            vueOptions.components = {
                'main-content': {
                    //页面模板
                    template: await themeService.loadTemplate(pageSetting.path),
                data: function() {
                    return Object.assign({
                        setting: pageSetting
                    }, componentData);
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
                pageData: componentData,
                setting: layoutConfig
            };

            //渲染
            const renderer = require('vue-server-renderer').createRenderer();
            const rendered = await renderer.renderToString(new Vue(vueOptions));
    }

    loadTheme(name) {
        ['assets', 'config', 'layout', 'sections', 'templates'].forEach((folder)=> {

        });

        fs.readdirSync(`./themes/${name}/config`);
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