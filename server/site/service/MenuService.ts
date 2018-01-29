const jsonfile = require('jsonfile');

export default class MenuService {
    async getMenus(): Promise<any> {
        const file = `./themes/default/config/menus.json`;
        const menus = jsonfile.readFileSync(file);
        return menus;
    }
}