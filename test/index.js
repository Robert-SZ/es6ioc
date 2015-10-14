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
            return error instanceof TypeError && error.message.indexOf('Type not registered') > -1;
        }, 'Type not registered error not detected');

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

        should.doesNotThrow(()=>ioc.resolve('TypeA'), 'not resolved');
    });
    it('value must be defined', ()=> {
        let ioc = new IoC();

        should.throws(()=>ioc.registerType('first', null), 'Value must be defined');
    });
    it('same aliases for same string', ()=> {
        let ioc = new IoC();
        ioc.registerType('first', 'a');

        should.doesNotThrow(()=>ioc.registerType('first', 'a'), 'Type already registered: first');
    });
    it('same aliases for different string', ()=> {
        let ioc = new IoC();
        ioc.registerType('first', 'a');

        should.throws(()=>ioc.registerType('first', 'b'), 'Type already registered: first');
    });
    it('same aliases for types with same == equality', ()=> {
        let ioc = new IoC();
        ioc.registerType('first', '0');

        should.throws(()=>ioc.registerType('first', 0), 'Type already registered: first');
    });

    it('same aliases for same boolean', ()=> {
        let ioc = new IoC();
        ioc.registerType('first', true);

        should.doesNotThrow(()=>ioc.registerType('first', true), 'Type already registered: first');
    });
    it('same aliases for different boolean', ()=> {
        let ioc = new IoC();
        ioc.registerType('first', true);

        should.throws(()=>ioc.registerType('first', false), 'Type already registered: first');
    });

    it('same aliases for same numbers', ()=> {
        let ioc = new IoC();
        ioc.registerType('first', 1);

        should.doesNotThrow(()=>ioc.registerType('first', 1), 'Type already registered: first');
    });
    it('same aliases for different numbers', ()=> {
        let ioc = new IoC();
        ioc.registerType('first', 1);

        should.throws(()=>ioc.registerType('first', 2), 'Type already registered: first');
    });

    it('same aliases for same dates', ()=> {
        let ioc = new IoC();
        var date=new Date();
        ioc.registerType('first', date);

        should.doesNotThrow(()=>ioc.registerType('first', date), 'Type already registered: first');
    });
    it('same aliases for different dates', ()=> {
        let ioc = new IoC();
        var date1= Date.parse('01/01/2015');
        var date2= Date.parse('01/02/2015');
        ioc.registerType('first', date1);

        should.throws(()=>ioc.registerType('first', date2), 'Type already registered: first');
    });
    it('same aliases for same object', ()=> {
        let ioc = new IoC();
        var obj={
            name: 'John'
        };
        ioc.registerType('first', obj);

        should.doesNotThrow(()=>ioc.registerType('first', obj), 'Type already registered: first');
    });
    it('same aliases for different objects', ()=> {
        let ioc = new IoC();
        var obj={
            name: 'John'
        };
        var obj2={
            name: 'John'
        };
        ioc.registerType('first', obj);

        should.throws(()=>ioc.registerType('first', obj2), 'Type already registered: first');
    });
    it('same aliases for same functions', ()=> {
        let ioc = new IoC();
        function A(){

        }
        ioc.registerType('first', A);

        should.doesNotThrow(()=>ioc.registerType('first', A), 'Type already registered: first');
    });
    it('same aliases for different functions', ()=> {
        let ioc = new IoC();
        function A(){

        }
        function B(){

        }
        ioc.registerType('first', A);

        should.throws(()=>ioc.registerType('first', B), 'Type already registered: first');
    });
});