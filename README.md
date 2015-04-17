# app_container
simple DI Container/Service Locator

## Examples

```js
var app_container = new diodac.AppContainer();

app_container.define('ENV_DEV', true);
app_container.set('test_value', 1);

app_container.set('log', function(msg) {
    console.log(msg);
});

app_container.register('screamer', {
    alert: function(msg) {
        alert(msg);
    }
});

app_container.defer('lazy', function(container) {
    container.run('log', ['I am lazy']);
    return 'I am not lazy!';
});

app_container.defer('useless', function(container) {
    var msg = container.get('ENV_DEV') ? 'dev' : 'prod';
    return {
        use: function() {
            return msg;
        }
    };
});
```

```js
app_container.get('ENV_DEV');
=> true

app_container.set('ENV_DEV', false);
(x) Uncaught You cannot override constant (ENV_DEV) value

app_container.get('lazy');
# I am lazy
=> "I am not lazy!"

app_container.get('lazy');
=> "I am not lazy!"

app_container.get('useless').use();
=> "dev"
```
