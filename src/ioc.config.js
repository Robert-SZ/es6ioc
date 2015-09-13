/**
 * Created by RobertSabiryanov on 11.09.15.
 */
import ioc from './ioc.js';
import {Provider} from './provider.js';
import {Logger} from './logger.js';
import {Logic} from './logic.js';

ioc.registerType('connectionString', 'http://api.com');
ioc.registerType('provider', Provider);
ioc.registerType('logger', Logger);
ioc.registerType('logic', Logic);
