const fs        = require('fs');
const jsonfile  = require('jsonfile');

class ThemeService {

    constructor() {
        this.db = null;
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

    async getAllTemplates() {
        const templates = fs.readdirSync(`${this.theme}/templates`);

        const allTemplates = [];

        for(const file of templates) {
            if (file.endsWith('.json')) {
                allTemplates.push(jsonfile.readFileSync(`${this.theme}/templates/${file}`));
            }
        }
        return allTemplates;
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

    async getSectionComponent(section:any): Promise<any> {
        const file = `${this.theme}/sections/${section.path}`;
        const sectionTemplate = fs.readFileSync(file, 'utf-8');
        const vueOptions: any = {
            props: {
                setting: {
                    type: Object,
                }
            },
            template: sectionTemplate
        };
        return vueOptions;
    }

    /**
     * 加载页面layout文件
     * @param {string} template
     * @returns {Promise<any>}
     */
    async loadLayout(layout) {
        const file = `${this.theme}/layout/${layout}.html`;
        const loaded = fs.readFileSync(file, 'utf-8');
        return loaded;
    }

    /**
     * 加载页面layout配置文件
     * @param {string} layout
     * @returns {Promise<any>}
     */
    async loadLayoutConfig(layout:string): Promise<any> {
        const file = `${this.theme}/layout/${layout}.json`;
        const config = jsonfile.readFileSync(file);
        return config;
    }

    async loadPageSetting(page:string): Promise<any> {
        try {
            const pageSetting = jsonfile.readFileSync(`${this.theme}/templates/${page}.json`);
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
    async loadTemplate(template:string): Promise<any> {
        const file = `${this.theme}/templates/${template}`;
        const loaded = fs.readFileSync(file, 'utf-8');
        return loaded;
    }
}

module.exports = ThemeService;