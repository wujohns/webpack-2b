/**
 * module bundler with simple configure
 */
'use strict';

const packageConfig = {
    // 基础说明配置
    name: 'webpack-2b',
    version: '2.0.0',
    author: 'wujohns',
    description: 'a wrap of webpack for libs packing',
    homepage: 'https://github.com/wujohns/webpack-2b',
    license: 'MIT',

    /**
     * repo
     */
    repository: {
        type: 'git',
        url: 'https://github.com/wujohns/webpack-2b.git'
    },

    /**
     * keywords
     */
    keywords: [
        'webpack', 'webpack-2b', 'gulp', 'libspack'
    ],

    /**
     * bugs
     */
    bugs: {
        url: 'https://github.com/wujohns/webpack-2b/issues'
    },

    /**
     * scripts todo
     */
    scripts: {
        test: './node_modules/mocha/bin/mocha ./test/build.test.js'
    },

    engine: {
        node: '>=4.0.0'
    },

    dependencies: {
        // basic modules
        'lodash': '^4.17.4',
        'async': '^2.5.0',
        'string-hash': '^1.1.3',

        // webpack
        'webpack': '^3.4.1'
    },

    devDependencies: {
        'mocha': '^3.5.0',
        'chai': '^4.1.1',
        'uglifyjs-webpack-plugin': '^0.4.6'
    }
};

const fs = require('fs');
const path = require('path');
const targetFile = path.join(__dirname, './package.json');
fs.writeFileSync(targetFile, JSON.stringify(packageConfig, null, 2), {
    encoding: 'utf8',
    flags: 'w',
    mode: 0o666
});