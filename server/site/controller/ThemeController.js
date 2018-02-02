const Vue = require('vue');
const send = require('koa-send');

const SectionList  = require('../vue/section-list.js');

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
export const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
};

/**
 * To render a static website page
 * @param {Application.Context} ctx
 * @param {Function} next
 */
async function renderSitePage(ctx , next ) {
    //Page name
    const page = ctx.params.page || 'index';

    //Page key
    const key = ctx.params.key || null;

    const themeService = ctx.services.theme;

    const loader = ctx.services.loader;

    const pageDataService = new PageDataService(template, key, ctx.query);

    //根模板、读取页面模板配置
    const pageSetting = await loader.loadPageSetting(page);

    if (pageSetting) {
        const componentData = await pageDataService.getPageData();
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
        const vueOptions: any = {};

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
        const singletonSectionsData: any = {};
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
        ctx.body = rendered;
    }
    await next();
}

async function downloadAssets(ctx: Koa.Context, next: Function) {
    if (ctx.body != null || ctx.status !== 404) return;
    try {
        await send(ctx, ctx.path.split('/').slice(2).join('/'), {
            root: themesPath
        });
    } catch (err) {
        if (err.status !== 404) {
            throw err;
        }
    }
}


module.exports = {
    downloadAssets,
    renderThemePage,
}