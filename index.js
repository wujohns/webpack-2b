/**
 * A wrap of webpack
 *
 * @author wujohns
 * @date 17/8/7
 */
'use strict';

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const async = require('async');
const webpack = require('webpack');
const stringHash = require('string-hash');

class Webpack2B {
    /**
     * Get the lib path which can be import
     * @param {String} libSrc - original path
     * @param {String} saveDir - target file saving path
     * @returns {String} - the path after transform
     * @static
     */
    static _getResolvePath (libSrc, saveDir) {
        if (/^(\.\/|\/|\.\.\/)/.test(libSrc)) {
            // only transform path of ('/', './', '../')
            const absolutePath = path.join(process.cwd(), libSrc);
            const relativePath = path.relative(saveDir, absolutePath);
            if (/^\./.test(relativePath)) {
                return relativePath.split(path.sep).join('/');
            }
            return `./${ relativePath.split(path.sep).join('/') }`;
        }
        return libSrc;
    }

    /**
     * libs packing
     * @param {Object} libsConfig - libs' packing config
     * @param {Array} libsConfig.libs - the config array, each item is the config of a lib
     * @param {String} libsConfig.[libs].src - the source path of the lib
     * @param {String} libsConfig.[libs].expose - the custom name of the lib
     * @param {String} libsConfig.savePath - the saving directory of the packed file
     * @param {String} libsConfig.globalField - global variable（defaults: 'WEBPACK_2B', whick means window.WEBPACK_2B）
     * @param {Object} webpackConfig - custom webpack config
     * @param {Function} callback - callback funcion
     * @static
     */
    static libsPack () {}

    /**
     * @param {Object} pagesConfig - pages' packing config
     * @param {Array} pagesConfig.pages - the config array, each item is the config of a page
     * @param {Array} pagesConfig.[pages].src - the source path of the pages
     * @param {String} pagesConfig.[pages].dest - the custom name of the page
     * @param {Object} pagesConfig.externals - the externals lib which will not be packed into the dest file
     * @param {Object} webpackConfig - custom webpack config
     * @param {Function} callback - 回调函数
     */
    static pagesPack () {}
}