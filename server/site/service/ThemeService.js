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





}

module.exports = ThemeService;