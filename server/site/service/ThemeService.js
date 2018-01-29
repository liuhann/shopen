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
const jsonfile = require('jsonfile');
class ThemeService {
    constructor(user, theme) {
        this.user = user;
        this.theme = theme;
    }
    getAllSectionComponents() {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = yield this.getSectionSettings();
            const components = {};
            for (const section of sections) {
                const vueOptions = yield this.getSectionComponent(section);
                components[section.component] = vueOptions;
            }
            return components;
        });
    }
    getAllTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = fs.readdirSync(`${this.theme}/templates`);
            const allTemplates = [];
            for (const file of templates) {
                if (file.endsWith('.json')) {
                    allTemplates.push(jsonfile.readFileSync(`${this.theme}/templates/${file}`));
                }
            }
            return allTemplates;
        });
    }
    getSectionSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = fs.readdirSync(`${this.theme}/sections`);
            const settings = [];
            for (const file of sections) {
                if (file.endsWith('.json')) {
                    settings.push(jsonfile.readFileSync(`${this.theme}/sections/${file}`));
                }
            }
            return settings;
        });
    }
    getSectionComponent(section) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = `${this.theme}/sections/${section.path}`;
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
        });
    }
    /**
     * 加载页面layout文件
     * @param {string} template
     * @returns {Promise<any>}
     */
    loadLayout(layout) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = `${this.theme}/layout/${layout}.html`;
            const loaded = fs.readFileSync(file, 'utf-8');
            return loaded;
        });
    }
    /**
     * 加载页面layout配置文件
     * @param {string} layout
     * @returns {Promise<any>}
     */
    loadLayoutConfig(layout) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = `${this.theme}/layout/${layout}.json`;
            const config = jsonfile.readFileSync(file);
            return config;
        });
    }
    loadPageSetting(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageSetting = jsonfile.readFileSync(`${this.theme}/templates/${page}.json`);
                return pageSetting;
            }
            catch (err) {
                return null;
            }
        });
    }
    /**
     * 加载页面body体文件
     * @param {string} template
     * @returns {Promise<any>}
     */
    loadTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = `${this.theme}/templates/${template}`;
            const loaded = fs.readFileSync(file, 'utf-8');
            return loaded;
        });
    }
}
exports.default = ThemeService;
//# sourceMappingURL=ThemeService.js.map