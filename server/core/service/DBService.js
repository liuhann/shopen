
class JsonDbService {

    constructor() {
        this.user = null;
    }

    getProperty() {
        const user = this.user.getCurrentUser();
        return user;
    }
}


module.exports = JsonDbService;