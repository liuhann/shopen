
class UserService {
    constructor() {
        this.db = null;
    }

    getCurrentUser() {
        return '110';
    }

    getUserSetting() {
        return {
            theme: 'default'
        };
    }

}

module.exports = UserService;
