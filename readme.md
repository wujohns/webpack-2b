# webpack-2b  
`webpack-2b` is a wrapper of webpack. The target of this tool is creating the libs packing file in easy way.

## Getting Started  
First install the package: `npm install webpack-2b`  
Building the lib file like this:  

```javascript
// build.js

const webpack2b = require('webpack-2b');
const libsConfig = {
    libs: [
        { src: 'async', expose: 'async' },
        { src: 'lodash', expose: 'lodash' },
        { src: './src/utils.js', expose: 'bbutils' }
    ],
    savePath: './dest/libs.js'
};
webpack2b.libsPack(libsConfig, (err) => {});
...
```

run `node build.js`, the lib file will be built and saved as `./dest/libs.js`，if you want to using the libs in
your page, you can do like this below:

add build action to `build.js`
```javascript
// build.js
...
const pagesConfig = {
    pages: [
        { src: ['./src/home.js'], dest: './dest/home.js' },
        { src: ['./src/profile.js'], dest: './dest/profile.js' }
    ],
    externals: webpack2b.getExternals(libsConfig)
};
webpack2b.pagesPack(pagesConfig, (err) => {});
```

`src/home.js`
```javascript
// src/home.js

// you can import the lib directly
import _ from 'loash';
import async from 'async';
import BBUtils from 'bbutils';

async.map([1000, 2000, 3000], function (delay, callback) {
    setTimeout(function () {
        console.log(delay);
        return callback(null, delay);
    }, delay);
}, function (err, results) {
    console.log(results);
});
...
```

in the html
```html
// home.html

<!DOCTYPE html>
<html>
<head>
    <title>Home</title>
</head>
<body>
    <script type="text/javascript" src="./dest/libs.js"></script>
    <script type="text/javascript" src="./dest/home.js"></script>
</body>
</html>
```

just enjoy it!

## API Usage  

### libsPack(libsConfig, [webpackConfig], callback)  
packing the libs file
`libsConfig` - Object, libs packing config  
`libsConfig.libs` - Array, the config array, each item is the config of a lib  
`libsConfig.[libs].src` - String, the source path of the lib  
`libsConfig.[libs].expose` - String, the custom name of the lib  
`libsConfig.savePath` - String, the saving directory of the packed file  
`libsConfig.globalField` - String, global variable（defaults: 'WEBPACK_2B', whick means window.WEBPACK_2B）  
`webpackConfig` - Object, custom webpack config excepts entry and output  
`callback` - Function, callback funcion  

### pagesPack(pagesConfig, [webpackConfig], callback)  
**notice** the pagesPack func of the webpack-2b in version 1.x has structure bug, please use webpack-2b >=2.0.0  
packing the page files  
`pagesConfig` - Object, pages packing config  
`pagesConfig.pages` - Array, the config array, each item is the config of a page  
`pagesConfig.[pages].src` - Array, the source path of the page  
`pagesConfig.[pages].name` - String, the file name of the page  
`pagesConfig.externals` - Object, the externals lib which will not be packed into the dest file  
`pagesConfig.destDir` - String, the save directory of the page  
`webpackConfig` - String, custom webpack config excepts entry, output, externals   
`callback` - Function, callback funcion  

### getExternals(libsConfig)  
Get the externals config by libsConfig  
`libsConfig` - Object, libs packing config  
`return` - the externals which will be used in pagesPack  

## Examples  

Just see [examples folder](/examples/)

## license  
MIT