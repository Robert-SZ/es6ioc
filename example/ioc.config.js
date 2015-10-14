/**
 * Created by RobertSabiryanov on 11.09.15.
 */
import Ioc from './../src/ioc.js';
import {Provider} from './provider.js';
import {Logger} from './logger.js';
import {Logic} from './logic.js';
import {Controller} from './controller.js';

const ioc = new Ioc();

ioc.registerType('logic', Logic);
ioc.registerType('connectionString', 'http://api.com');
ioc.registerType('logger', Logger);
ioc.registerType('provider', Provider);
ioc.registerType('controller', Controller);
ioc.testConfig();

export default ioc;
