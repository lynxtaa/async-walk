# async-walk
Crossplatform promise-based recursive walk within folder. Requires ES6 support.

Install
--------
`npm install async-walk --save`

Syntax
--------
```javascript
require('async-walk')(path)
```

- `path`  *`<string>`* path to folder

Returns `Promise` which fulfills to array of absolute file paths.

Usage
--------
```javascript
const asyncWalk = require('async-walk')
asyncWalk('/some/folder')
  .then(paths => {
    console.log(paths)  // ["/some/folder/file1.txt", "/some/folder/file2.txt"...]
  })
  .catch(console.log.bind(console))
```
