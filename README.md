# es6ioc
ES6 Dependency Injection container

# Languages

 [English](#en)
 [Русский](#ru)

[<a name="en"></a> # Dependency Annotation

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

# Register

To define your types in container you have to use 'registerType' method. Method tells the container instantiate object
that requires by concrete injection. To map types container uses string aliases.

Example:
```
ioc.registerType('logger', Logger);
```

# Resolve

<a name="ru"></a> # Опеределение зависимостей