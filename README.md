# mycro-util-policies
a hook that common policies for [mycro](https://github.com/cludden/mycro) apps


## Install
Install the package
```
npm install --save mycro-util-policies
```

Include it in your `/config/hooks.js` file after the default `policies` hook
```javascript
// in config/hooks/js

module.exports = [
    // ..
    'policies',
    'mycro-util-policies'
    // ..
];
```


## Policies
#### #if
Executes a policy, and based on whether or not the policy fails, executes a pass or fail policy.  
###### Arguments
1. **testPolicy** *(string|function)* - the policy to test
2. **passPolicy** *(string|function)* - the policy to execute if the test policy passes
3. **failPolicy** *(string|function)* - the policy to execute if the test policy fails

```javascript
// in app/routes.js
module.exports = function(mycro) {
    return {
        'v1.0.0': {
            '/posts': {
                policies: [
                    mycro.policies.if(
                        mycro.policies.memberOf('editors'),
                        mycro.policies.filter({status: ['published', 'unpublished']}),
                        mycro.policies.filter({status: ['published']})
                    )
                ]
            }
        }
    }
};
```
---
#### #not
Inverts the outcome of a policy.
###### Arguments
1. **policy** *(string|function)* - the policy to invert
2. [**options**] *(object)*  - options  
3. [**options.error**] *(object)* - custom error options
4. [**options.error.status**] *(number)* - custom error response status (defaults to 400)
5. [**options.error.error**] *(string|object)* - custom error response error

```javascript
// in app/routes.js
module.exports = function(mycro) {
    return {
        'v1.0.0': {
            '/posts': {
                policies: [
                    mycro.policies.if(
                        mycro.policies.not('authenticated'),
                        mycro.policies.filter({scope: 'public', status: 'published'}),
                        mycro.policies.filter({scope: '*', status: 'published'})
                    )
                ]
            }
        }
    }
};
```
---
#### #or
Tests multiple policies, until one passes, in which case the policy passes. Otherwise, the policy fails.
###### Arguments
1. **policies** *(...string|function)* - one or more policies to test
2. [**options**] *(object)*  - options  
3. [**options.handleError**] *(function)*  - error handler policy (req, res, next)
4. [**options.error**] *(object)* - custom error options
5. [**options.error.status**] *(number)* - custom error response status (defaults to 403)
6. [**options.error.error**] *(string|object)* - custom error response error (defaults to 'Forbidden')

```javascript
// in app/routes.js
module.exports = function(mycro) {
    return {
        'v1.0.0': {
            '/posts': {
                policies: [
                    mycro.policies.if(
                        mycro.policies.not('authenticated'),
                        mycro.policies.filter({scope: 'public', status: 'published'}),
                        mycro.policies.filter({scope: '*', status: 'published'})
                    )
                ]
            }
        }
    }
};
```
---
#### #validate
Validate the request using [joi](https://github.com/hapijs/joi), returns 401 if validation fails.
###### Arguments
1. [**container**] *(string)* - the part of the request to validate (body, cookies, headers, query). if no container is specified, the entire request is validated. The validated attributes are then merged into the request object.
2. **factoryFn** *(function)* - a function that receives a `joi` instance and returns a valid `joi` schema.
3. [**options**] *(object)* - `joi` validation options
4. [**options.error**] *(object)* - custom error options
5. [**options.error.status**] *(number)* - custom error response status (defaults to 400)
6. [**options.error.error**] *(string|object)* - custom error response error

```javascript
// in app/routes.js
module.exports = function(mycro) {
    return {
        'v1.0.0': {
            '/posts': {
                policies: [
                    // limit query params to id, title, and status
                    mycro.policies.validate('query', function(joi) {
                        return joi.object({
                            id: joi.number().integer()
                            title: joi.string(),
                            status: joi.string().valid('published', 'unpublished').default('published')
                        })
                    }, {
                        allowUnknown: true,
                        convert: true,
                        stripUnknown: true
                    })
                ]
            }
        }
    }
};
```


## Testing
run all tests  
```javascript
npm test
```

run coverage
```javascript
grunt coverage
```


## Contributing
1. [Fork it](https://github.com/kutlerskaggs/mycro-util-policies/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


## License
Copyright (c) 2016 Kutler Skaggs, Inc.
Licensed under the [MIT license](LICENSE.md).
