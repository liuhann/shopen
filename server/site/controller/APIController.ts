import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as fs from "fs";
const debug = require('debug')('shopnt-website');

import ThemeService from '../service/ThemeService';
import PageDataService from '../service/PageDataService';

const jsonfile = require('jsonfile');
const themesPath = 'modules/theme_default';

async function getSectionSettings(ctx: Koa.Context, next: Function) {
    const sections = fs.readdirSync(`${themesPath}/sections`);

    const settings = [];
    for(const file of sections) {
        if (file.endsWith('.json')) {
            settings.push(jsonfile.readFileSync(`${themesPath}/sections/${file}`));
        }
    }

    ctx.body = {
        statusCode: '2000000',
        settings
    };
}

async function getGlobalData(ctx: Koa.Context, next: Function) {
    const pageDataService = new PageDataService('','','');
    ctx.body = {
        statusCode: '2000000',
        global: await pageDataService.getGlobalData(),
    };
}

async function getConfigurablePages(ctx: Koa.Context, next: Function) {
    const themeService = new ThemeService('', themesPath);
    const templates = await themeService.getAllTemplates();
    ctx.body = {
        statusCode: '2000000',
        templates
    }
}

async function getPageData(ctx: Koa.Context, next: Function) {
    const template: string = ctx.params.template || 'index';
    const key: string = ctx.params.key || null;

    const pageDataService = new PageDataService(template, key, ctx.query);

    const data = await pageDataService.getPageData();
    ctx.sendResponse(data);
}

async function updatePageSetting(ctx: any, next: Function) {
    const page: string = ctx.params.page;
    const pageData = jsonfile.readFileSync(`${themesPath}/templates/${page}.json`);
    pageData.components = ctx.request.body.components;
    jsonfile.writeFileSync(`${themesPath}/templates/${page}.json`, pageData, {spaces: 2, EOL: '\r\n'});

    const pageLayout = jsonfile.readFileSync(`${themesPath}/layout/${pageData.layout}.json`);
    pageLayout.components = ctx.request.body.layoutComponents;
    jsonfile.writeFileSync(`${themesPath}/layout/${pageData.layout}.json`, pageLayout, {spaces: 2, EOL: '\r\n'});

    ctx.sendResponse({
        ok: true
    });
}

async function getNavigationList(ctx: Koa.Context, next: Function) {
    const list = await ctx.dataDao.getAllNavigation();
    debug('nav list', list);
    ctx.sendResponse({
        list
    });
}

async function addNavigation(ctx: Koa.Context, next: Function) {
    const result = await ctx.dataDao.updateNavigation(ctx.body);
    ctx.sendResponse({
        result
    });
}

export {
    getConfigurablePages,
    getSectionSettings,
    updatePageSetting,
    getGlobalData,
    getPageData,
    getNavigationList,
}
