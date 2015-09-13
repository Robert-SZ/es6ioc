/**
 * Created by RobertSabiryanov on 11.09.15.
 */
import iocconfig from './ioc.config.js';
import ioc from './ioc.js';

class Controller {
    constructor() {
        this.logic  = ioc.resolve('logic');
    }

    get() {
        return this.logic.getReversedData();
    }
}

export default {Controller};
