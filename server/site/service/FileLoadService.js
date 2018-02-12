const jsonfile  = require('jsonfile');
const fs = require('fs');

class FileLoadService {

    constructor() {
        this.user = null;
    }

    getBaseFolder() {
        return './themes/' + this.user.getUserSetting().theme;
    }

    async loadThemedSetting() {
	    const globalDir = fs.readdirSync(`${this.getBaseFolder()}/global`);
	    let themeSetting = {};
	    for(const file of globalDir) {
		    if (file.endsWith('.json')) {
		    	const config = jsonfile.readFileSync(`${this.getBaseFolder()}/global/${file}`);
			    themeSetting = Object.assign(themeSetting, config);
		    }
	    }
	    return themeSetting;
    }

    /**
     * 加载页面layout文件
     * @param {string} template
     * @returns {Promise<any>}
     */
    async loadLayout(layout) {
        const file = `${this.getBaseFolder()}/layout/${layout}`;
        const loaded = fs.readFileSync(file, 'utf-8');
        return loaded;
    }

    async loadPageSetting(page) {
        try {
            const pageSetting = jsonfile.readFileSync(`${this.getBaseFolder()}/templates/${page}.json`);
            return pageSetting;
        } catch (err) {
            return null;
        }
    }

    /**
     * 加载页面body体文件
     * @param {string} template
     * @returns {Promise<any>}
     */
    async loadTemplate(template){
        const file = `${this.getBaseFolder()}/templates/${template}`;
        const loaded = fs.readFileSync(file, 'utf-8');
        return loaded;
    }

    async getAllTemplates() {
        const templates = fs.readdirSync(`${this.getBaseFolder()}/templates`);

        const allTemplates = [];

        for(const file of templates) {
            if (file.endsWith('.json')) {
                allTemplates.push(jsonfile.readFileSync(`${this.getBaseFolder()}/templates/${file}`));
            }
        }
        return allTemplates;
    }

    async getAllSections() {
	    const sections = fs.readdirSync(`${this.getBaseFolder()}/sections`);
	    const settings = [];
	    for(const file of sections) {
		    if (file.endsWith('.json')) {
			    settings.push(jsonfile.readFileSync(`${this.getBaseFolder()}/sections/${file}`));
		    }
	    }
	    return settings;
    }

    async getSectionTemplate(section) {
	    const file = `${this.getBaseFolder()}/sections/${section.path}`;
	    const sectionTemplate = fs.readFileSync(file, 'utf-8');
	    return sectionTemplate;
    }

	async getSectionComponent(section) {
		const file = `${this.getBaseFolder()}/sections/${section.path}`;
		const sectionTemplate = fs.readFileSync(file, 'utf-8');
		const vueOptions = {
			props: {
				setting: {
					type: Object,
				}
			},
			template: sectionTemplate
		};
		return vueOptions;
	}

}


module.exports = FileLoadService;