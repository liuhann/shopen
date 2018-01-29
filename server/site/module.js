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
const Router = require("koa-router");
const ThemeController_1 = require("./controller/ThemeController");
const LowPageDataService_1 = require("./service/LowPageDataService");
const APIController_1 = require("./controller/APIController");
exports.default = {
    route(router) {
        //website static pages
        router.get('/', ThemeController_1.renderThemePage);
        router.get('/:template', ThemeController_1.renderThemePage);
        router.get('/:template/:key', ThemeController_1.renderThemePage);
        //website resources
        router.get('/static/*', ThemeController_1.downloadAssets);
        //website api setting routes
        const apis = new Router();
        apis.get('/section/settings', APIController_1.getSectionSettings);
        apis.get('/global/data', APIController_1.getGlobalData);
        apis.get('/data/:template/:key', APIController_1.getPageData);
        apis.get('/template/list', APIController_1.getConfigurablePages);
        apis.get('/navigation/list', APIController_1.getNavigationList);
        apis.post('/setting/:page', APIController_1.updatePageSetting);
        router.use('/api', apis.routes());
    },
    middleware(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.website = {};
            ctx.dataDao = new LowPageDataService_1.default('./lowdb.json');
            yield next();
        });
    }
};
//# sourceMappingURL=module.js.map