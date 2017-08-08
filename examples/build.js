/**
 * build scripts (just run 'node build.js' to build the files)
 *
 * @author wujohns
 * @date 17/8/8
 */
'use strict';

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
        { src: ['./src/home.js'], dest: './dest/home.js' },
        { src: ['./src/profile.js'], dest: './dest/profile.js' }
    ],
    externals: webpack2b.getExternals(libsConfig)
};

const webpackConfig = {
    plugins: [
        new UglifyJsPlugin()
    ]
};

webpack2b.libsPack(libsConfig, webpackConfig, (err) => {
    // do nothing
});

webpack2b.pagesPack(pagesConfig, webpackConfig, (err) => {
    // do nothing
});