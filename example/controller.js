/**
 * Created by RobertSabiryanov on 11.09.15.
 */
class Controller {
    constructor(logic) {
        this.logic  = logic;
    }

    get() {
        return this.logic.getReversedData();
    }
}

Controller.$inject = ['logic']

export default {Controller};
