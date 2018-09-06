# shopen

Plugined Node.js server platform based on koa 2

## Download and install

Shopen is quite easy to deploy and install. It use nodejs as base server and if you know some nodejs, it's quite easy。

1. Download latest node version
2. Download or clone shopen.
3. run `npm install`
4. run `npm run server`



## Basic Concept

### package

A bundle with some services which could appose to http or provided to other bundle。

All bundles are placed under shopen/packages folder and shopen server scan and init them。

A bundle could only be initialized if it has an index.js under the folder.  like this

```javascript
module.exports = {
  name: 'core',

  created (app) {
   
  },

  ready (app) {

  },

  bootComplete (app) {
   
  }
}

```



## service

Service counld be included inside bundle  and created in bundle created hook



```javascript
class DictionaryService {
  constructor () {
    this.mongo = null
  }
}
module.exports = DictionaryService
```

```javascript
module.exports = {
  name: 'dictionary',

  created (app) {
    app.context.services.dictionary = new DictionaryService()
  },

  ready (app) {
 
  }
}

```

### Service Auto Injection

DictionaryService is registed to app.context.servers as dictionary。 so after all the bundle loaded and created, shopen would inject mongo to DictionaryService if app.context.services.mongo exists



