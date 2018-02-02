class AssertService {
    constructor() {

    }

    /**
     * assert actual === expect , or throw error with code and message
     * @param actural
     * @param expect
     * @param code
     * @param msg
     */
    equal(actual, expect, code, msg) {
        if (actual === expect) {
            return;
        }
        throw {
            code, msg
        };
    }
}

module.exports = AssertService