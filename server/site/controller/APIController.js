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
const fs = require("fs");
const debug = require('debug')('shopnt-website');
const ThemeService_1 = require("../service/ThemeService");
const PageDataService_1 = require("../service/PageDataService");
const jsonfile = require('jsonfile');
const themesPath = 'modules/theme_default';
function getSectionSettings(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sections = fs.readdirSync(`${themesPath}/sections`);
        const settings = [];
        for (const file of sections) {
            if (file.endsWith('.json')) {
                settings.push(jsonfile.readFileSync(`${themesPath}/sections/${file}`));
            }
        }
        ctx.body = {
            statusCode: '2000000',
            settings
        };
    });
}
exports.getSectionSettings = getSectionSettings;
function getGlobalData(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const pageDataService = new PageDataService_1.default('', '', '');
        ctx.body = {
            statusCode: '2000000',
            global: yield pageDataService.getGlobalData(),
        };
    });
}
exports.getGlobalData = getGlobalData;
function getConfigurablePages(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const themeService = new ThemeService_1.default('', themesPath);
        const templates = yield themeService.getAllTemplates();
        ctx.body = {
            statusCode: '2000000',
            templates
        };
    });
}
exports.getConfigurablePages = getConfigurablePages;
function getPageData(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const template = ctx.params.template || 'index';
        const key = ctx.params.key || null;
        const pageDataService = new PageDataService_1.default(template, key, ctx.query);
        const data = yield pageDataService.getPageData();
        ctx.sendResponse(data);
    });
}
exports.getPageData = getPageData;
function updatePageSetting(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = ctx.params.page;
        const pageData = jsonfile.readFileSync(`${themesPath}/templates/${page}.json`);
        pageData.components = ctx.request.body.components;
        jsonfile.writeFileSync(`${themesPath}/templates/${page}.json`, pageData, { spaces: 2, EOL: '\r\n' });
        const pageLayout = jsonfile.readFileSync(`${themesPath}/layout/${pageData.layout}.json`);
        pageLayout.components = ctx.request.body.layoutComponents;
        jsonfile.writeFileSync(`${themesPath}/layout/${pageData.layout}.json`, pageLayout, { spaces: 2, EOL: '\r\n' });
        ctx.sendResponse({
            ok: true
        });
    });
}
exports.updatePageSetting = updatePageSetting;
function getNavigationList(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = yield ctx.dataDao.getAllNavigation();
        debug('nav list', list);
        ctx.sendResponse({
            list
        });
    });
}
exports.getNavigationList = getNavigationList;
function addNavigation(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield ctx.dataDao.updateNavigation(ctx.body);
        ctx.sendResponse({
            result
        });
    });
}
//# sourceMappingURL=APIController.js.map