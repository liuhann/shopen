const FileLoadService = require('./service/FileLoadService');
const ThemeService = require('./service/ThemeService');
const PageDataService = require('./service/PageDataService');

const ThemedController  = require('./controller/ThemedController');

module.exports = {
    name : 'site',
    async services() {
        return {
            loader: new FileLoadService(),
            theme: new ThemeService(),
            pageData: new PageDataService(),
        }
    },

    async paths() {
        return {
            '/': {
                'get': ThemedController.renderSitePage
            },
            '/:page': {
                'get': ThemedController.renderSitePage
            },
            '/:page/*': {
                'get': ThemedController.renderSitePage
            }
        }
    },

    route(router) {
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
}