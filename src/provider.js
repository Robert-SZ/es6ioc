/**
 * Created by RobertSabiryanov on 14.09.15.
 */
class Provider {
    constructor(connectionString, logger) {
        this.connectionString = connectionString;
        this.logger = logger;
    }

    getData() {
        this.logger.log('ConnectionString: ' + this.connectionString);
        this.logger.log('getData');
        return [1, 2, 3, 4, 5];
    }
}

Provider.$inject = ['connectionString', 'logger'];

export default {Provider};