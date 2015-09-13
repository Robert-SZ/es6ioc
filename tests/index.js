/**
 * Created by RobertSabiryanov on 11.09.15.
 */

import {Controller} from '../src/controller.js';

describe('Controller', () => {
    it('ioc', () => {
        console.log('test start');
        let controller = new Controller();
        let result = controller.get();
        expect(result.length).toBe(5);
    });
});