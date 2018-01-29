import * as Koa from 'koa';
import * as Router from 'koa-router';
import {renderThemePage, downloadAssets} from "./controller/ThemeController";

import LowPageDataService from './service/LowPageDataService';

import {
    getConfigurablePages,
    getSectionSettings,
    updatePageSetting,
    getGlobalData,
    getNavigationList,
    getPageData} from "./controller/APIController";

export default {
    route(router: Router) {
        //website static pages
        router.get('/', renderThemePage);
        router.get('/:template', renderThemePage);
        router.get('/:template/:key', renderThemePage);
        //website resources
        router.get('/static/*', downloadAssets);

        //website api setting routes
        const apis = new Router();
        apis.get('/section/settings', getSectionSettings);
        apis.get('/global/data', getGlobalData);
        apis.get('/data/:template/:key', getPageData);
        apis.get('/template/list', getConfigurablePages);
        apis.get('/navigation/list', getNavigationList);
        apis.post('/setting/:page', updatePageSetting);
        router.use('/api', apis.routes());
    },

    async middleware(ctx:Koa.Context, next: Function) {
        ctx.website = {};
        ctx.dataDao = new LowPageDataService('./lowdb.json');
        await next();
    }
}
