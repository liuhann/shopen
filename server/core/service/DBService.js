
class JsonDbService {

    constructor(app) {
        this.app = app;
    }

    set user(value) {}

    getProperty() {
        const user = this.app.context.core.user.getCurrentUser()
        return user;
    }
}


module.exports = JsonDbService;