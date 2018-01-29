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
//import * as Vue from 'vue';
const Vue = require('vue');
const send = require('koa-send');
const ThemeService_1 = require("../service/ThemeService");
const PageDataService_1 = require("../service/PageDataService");
const themesPath = 'modules/theme_default';
const SectionList = require('../vue/section-list.js');
/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
exports.camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
};
/**
 * 渲染vue页面入口
 * @param {Application.Context} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
function renderThemePage(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const template = ctx.params.template || 'index';
        const key = ctx.params.key || null;
        const themeService = new ThemeService_1.default('', themesPath);
        const pageDataService = new PageDataService_1.default(template, key, ctx.query);
        //根模板、读取页面模板配置
        const pageSetting = yield themeService.loadPageSetting(template);
        if (pageSetting) {
            const componentData = yield pageDataService.getPageData();
            //加载所有sections 包括单例模板
            const sectionComponents = yield themeService.getAllSectionComponents();
            for (let componentName in sectionComponents) {
                sectionComponents[componentName].data = function () {
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
            const layoutConfig = yield themeService.loadLayoutConfig(layout);
            vueOptions.template = yield themeService.loadLayout(layout);
            vueOptions.components = {
                'main-content': {
                    //页面模板
                    template: yield themeService.loadTemplate(pageSetting.path),
                    data: function () {
                        return Object.assign({
                            setting: pageSetting
                        }, componentData);
                    }
                }
            };
            //设置根模板的数据
            const singletonSectionsData = {};
            const settings = yield themeService.getSectionSettings();
            for (const setting of settings) {
                if (setting.singleton) {
                    singletonSectionsData[exports.camelize(setting.component)] = setting.data;
                }
            }
            vueOptions.data = {
                pageData: componentData,
                setting: layoutConfig
            };
            //渲染
            const renderer = require('vue-server-renderer').createRenderer();
            const rendered = yield renderer.renderToString(new Vue(vueOptions));
            ctx.body = rendered;
        }
        yield next();
    });
}
exports.renderThemePage = renderThemePage;
function downloadAssets(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.body != null || ctx.status !== 404)
            return;
        try {
            yield send(ctx, ctx.path.split('/').slice(2).join('/'), {
                root: themesPath
            });
        }
        catch (err) {
            if (err.status !== 404) {
                throw err;
            }
        }
    });
}
exports.downloadAssets = downloadAssets;
//# sourceMappingURL=ThemeController.js.map