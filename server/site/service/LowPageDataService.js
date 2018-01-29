"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const low = require('lowdb');
const shortid = require('shortid');
const FileSync = require('lowdb/adapters/FileSync');
class LowPageDataService {
    constructor(db) {
        this.adapter = new FileSync(db);
        this.db = low(this.adapter);
        debugger;
    }
    getAllNavigation() {
        return this.db.get('navigation').value();
    }
    updateNavigation(navigation) {
        if (!navigation.id) {
            navigation.id = shortid.generate();
        }
        const target = this.db.get('navigation').find({ id: navigation.id });
        if (target) {
            target.assign(navigation).write();
        }
        else {
            this.db.get('navigation').push(navigation);
        }
    }
    getMenus() {
    }
}
exports.default = LowPageDataService;
//# sourceMappingURL=LowPageDataService.js.map