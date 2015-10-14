/**
 * Created by RobertSabiryanov on 11.09.15.
 */

import IoC from '../src/ioc.js'
import should from 'should'

describe('IoC', () => {
    it('should be detect circular dependencies', () => {
        function TypeA() {
        }

        TypeA.$inject = ['TypeB'];

        function TypeB() {
        }

        TypeB.$inject = ['TypeC'];

        function TypeC() {
        }

        TypeC.$inject = ['TypeA'];

        let ioc = new IoC();
        ioc.registerType('TypeA', TypeA);
        ioc.registerType('TypeB', TypeB);

        should.throws(()=>ioc.registerType('TypeC', TypeC), function (error) {
            return error instanceof TypeError && error.message.indexOf('CircularDependencies') > -1;
        }, 'CircularDependencies error not detected');
    });

    it('should be detect circular dependencies', () => {
        function TypeA() {
        }

        TypeA.$inject = ['TypeB'];

        function TypeB() {
        }

        TypeB.$inject = ['TypeC'];

        function TypeC() {
        }

        TypeC.$inject = ['TypeA'];

        let ioc = new IoC();
        ioc.registerType('TypeC', TypeC);
        ioc.registerType('TypeB', TypeB);

        should.throws(()=>ioc.registerType('TypeA', TypeA), function (error) {
            return error instanceof TypeError && error.message.indexOf('CircularDependencies') > -1;
        }, 'CircularDependencies error not detected');
    });

    it('should be detect circular dependencies', () => {
        function TypeA() {
        }

        TypeA.$inject = ['TypeB'];

        function TypeB() {
        }

        TypeB.$inject = ['TypeA'];

        let ioc = new IoC();
        ioc.registerType('TypeB', TypeB);

        should.throws(()=>ioc.registerType('TypeA', TypeA), function (error) {
            return error instanceof TypeError && error.message.indexOf('CircularDependencies') > -1;
        }, 'CircularDependencies error not detected');
    });

    it('should be detect circular dependencies', () => {
        function TypeA() {
        }

        TypeA.$inject = ['TypeA'];

        let ioc = new IoC();
        should.throws(()=>ioc.registerType('TypeA', TypeA), function (error) {
            return error instanceof TypeError && error.message.indexOf('CircularDependencies') > -1;
        }, 'CircularDependencies error not detected');
    });

    it('should be detect not registered dependencies', () => {
        function TypeA() {
        }

        TypeA.$inject = ['TypeB'];

        function TypeB() {
        }

        TypeB.$inject = ['TypeC', 'TypeD'];

        function TypeC() {
        }


        let ioc = new IoC();
        ioc.registerType('TypeC', TypeC);
        ioc.registerType('TypeB', TypeB);
        ioc.registerType('TypeA', TypeA);

        should.throws(()=>ioc.resolve('TypeA'), function (error) {
            return error instanceof TypeError && error.message.indexOf('Type not registred') > -1;
        }, 'Type not registred error not detected');

    });

    it('should be dependencies', () => {
        function TypeA() {
        }

        TypeA.$inject = ['TypeB'];

        function TypeB() {
        }

        TypeB.$inject = ['TypeC', 'TypeD'];

        function TypeC() {
        }

        TypeC.$inject = ['TypeD'];

        let ioc = new IoC();
        ioc.registerType('TypeC', TypeC);
        ioc.registerType('TypeB', TypeB);
        ioc.registerType('TypeA', TypeA);
        ioc.registerType('TypeD', 'simple string');

        should.doesNotThrow(()=>ioc.resolve('TypeA'),'not resolved');
    });
});