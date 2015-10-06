/**
 * Created by RobertSabiryanov on 11.09.15.
 */
import ioc from './../src/ioc.js';
import {Provider} from './provider.js';
import {Logger} from './logger.js';
import {Logic} from './logic.js';

ioc.registerType('logic', Logic);
ioc.registerType('connectionString', 'http://api.com');
ioc.registerType('logger', Logger);
ioc.registerType('provider', Provider);
ioc.testConfig();
