# es6ioc
ES6 Dependency Injection container

# Languages

 * [English](#en)
 * [Русский](#ru)

# <a name="en"></a>Motivation

1. Implement DI principles
2. Testability
3. Customization by configuration file

##Dependency Annotation

Similar to AngularJs 1.x you must to annotate your ES6 classes with $inject property that container knows what types to
inject into constructor.
```
class Provider {
    constructor(connectionString, logger) {
        this.connectionString = connectionString;
        this.logger = logger;
    }
    getData() {
    }
}
Provider.$inject = ['connectionString', 'logger'];
```

## Register

To define your types in container you have to use 'registerType' method. Method tells the container instantiate object
that requires by concrete injection. To map types container uses string aliases.

Example:
```
import IoC from ‘ioc.js’

const ioc = new IoC();
ioc.registerType('connectionString', 'http://api.com');
ioc.registerType('logger', Logger);
ioc.registerType('provider', Provider);
```

## Resolve

To instatiate concrete object and it's dependencies you have to use 'resolve' method.

```
ioc.resolve('logic');
```
Note that object do not instantiated directly, rather you just say: "Hey, ioc give me the 'logic'". And container
first construct object dependencies and then passes them to required object constructor.

# <a name="ru"></a>Цели
  1. Реализация принципов DI
  2. Повышение тестируемости кода
  3. Возможность конфигурирования приложения

## Опеределение зависимостей

Также как в AngularJs 1.x вам нужно определить статическое свойство $inject.
Это позволить IoC контейнеру определить какие зависимости требует ваш класс.
```
class Provider {
    constructor(connectionString, logger) {
        this.connectionString = connectionString;
        this.logger = logger;
    }
    getData() {
    }
}
Provider.$inject = ['connectionString', 'logger'];
```

## Регистрация зависимостей

Первым делом необходиму указать контейнеру соотвествие имени зависимости и класса реализации.

Пример:
```
import IoC from ‘ioc.js’

const ioc = new IoC();

ioc.registerType('logger', Logger);
```

## Создание экземпляров объектов

Для создания конкретного объекта необходимо вызвать метод resolve
```
ioc.resolve('logic');
```
Обратите внимание, что явного создания зависимойстей не происходит. Вы просто говорите контейнеру: "Создай мне зависимость logic".
При этом сначала будут созданы все зависимости, а затем сам запрашиваемый объект.
