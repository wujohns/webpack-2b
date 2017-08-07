/**
 * module bundler with simple configure
 */
'use strict';

const packageConfig = {
    // 基础说明配置
    name: 'webpack-2b',
    version: '0.0.1',
    author: 'wujohns',
    description: 'a wrap of webpack for libs packing',
    license: 'MIT',

    /**
     * scripts
     */
    scripts: {
        // test: './node_modules/mocha/bin/mocha ./test/build.test.js'
    },

    engine: {
        node: '>=4.0.0'
    },

    dependencies: {
        // 基础库
        'lodash': '^4.17.4',
        'async': '^2.5.0',
        'string-hash': '^1.1.3',

        // webpack
        'webpack': '^3.4.1'
    },

    devDependencies: {}
};

const fs = require('fs');
const path = require('path');
const targetFile = path.join(__dirname, './package.json');
fs.writeFileSync(targetFile, JSON.stringify(packageConfig, null, 2), {
    encoding: 'utf8',
    flags: 'w',
    mode: 0o666
});