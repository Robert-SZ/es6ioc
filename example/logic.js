/**
 * Created by RobertSabiryanov on 11.09.15.
 */
class Logic {
    constructor(provider, logger) {
        this.provider = provider;
        this.logger = logger;
    }

    getReversedData() {
        this.logger.log('getReversedData');
        return this.provider.getData().reverse();
    }
}
Logic.$inject = ['provider', 'logger'];

export default {Logic};