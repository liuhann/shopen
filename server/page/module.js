
module.exports = {
    name : 'site-page-setting',
	type : '',
	
    async services() {
        return {
            loader: new FileLoadService(),
            theme: new ThemeService(),
            page: new PageDataService(),
	        navigation: new NavigationService(),
        }
    },

    async paths() {
        return {
            '/:site/page/:name': {
                'get': ThemedController.renderSitePage
            }
        }
    },
}