/**
 * build scripts (just run 'node build.js' to build the files)
 *
 * @author wujohns
 * @date 17/8/8
 */
'use strict';

const fs = require('fs');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack2b = require('../index.js');

const libsConfig = {
    libs: [
        { src: 'async', expose: 'async' },
        { src: 'lodash', expose: 'lodash' },
        { src: './src/utils.js', expose: 'bbutils' }
    ],
    savePath: './dest/libs.js'
};

const pagesConfig = {
    pages: [
        { src: ['./src/home.js'], name: 'home' },
        { src: ['./src/profile.js'], name: 'profile' }
    ],
    externals: webpack2b.getExternals(libsConfig),
    destDir: './dest'
};

const webpackConfig = {
    plugins: [
        new UglifyJsPlugin()
    ]
};

try {
    fs.readdirSync('./dest');
} catch (err) {
    if (err) {
        fs.mkdirSync('./dest');
    }
}

webpack2b.libsPack(libsConfig, webpackConfig, (err) => {
    // do nothing
});

webpack2b.pagesPack(pagesConfig, webpackConfig, (err) => {
    // do nothing
});