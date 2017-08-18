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
     * @param {Object} webpackConfig - custom webpack config except entry and output
     * @param {Function} callback - callback funcion
     * @static
     */
    static libsPack (libsConfig, webpackConfig, callback) {
        if (typeof webpackConfig === 'function') {
            callback = webpackConfig;
            webpackConfig = {};
        }

        const libs = _.get(libsConfig, 'libs', []);
        const globalField = _.get(libsConfig, 'globalField', 'WEBPACK_2B');
        
        let savePath = libsConfig.savePath;
        if (!path.isAbsolute(savePath)) {
            savePath = path.join(process.cwd(), savePath);
        }

        const saveDir = path.dirname(savePath);
        const saveExtname = path.extname(savePath);
        const saveBasename = path.basename(savePath, saveExtname);
        const tempPath = path.format({
            dir: saveDir,
            name: `${ saveBasename }.temp`,
            ext: saveExtname
        });

        async.auto({
            // create temp lib file
            tempLib: (callback) => {
                let tempFileContent = `
                    'use strict';
                    window.${ globalField } = window.${ globalField } || {};
                `;

                // import packages and concat the content
                _.forEach(libs, (lib) => {
                    // the path in temp file
                    const libSrc = Webpack2B._getResolvePath(lib.src, saveDir);
                    const libVarName = `${ globalField }_${ stringHash(lib.expose).toString(36) }`;
                    tempFileContent = `
                        ${ tempFileContent }
                        import ${ libVarName } from '${ libSrc }';
                        import * as _${ libVarName } from '${ libSrc }';
                        window.${ globalField }['${ lib.expose }'] = ${ libVarName } || _${ libVarName };
                    `;
                });

                // create temp file by using fs
                fs.writeFile(tempPath, tempFileContent, {
                    encoding: 'utf8',
                    flags: 'w',
                    mode: 0o666
                }, callback);
            },
            // create the target libs file by using webpack
            build: ['tempLib', (results, callback) => {
                const entry = {};
                entry[saveBasename] = [tempPath];
                webpack(_.defaults({
                    entry: entry,
                    output: {
                        path: saveDir,
                        filename: `${ saveBasename }${ saveExtname }`
                    },
                    externals: libsConfig.externals
                }, webpackConfig), callback);
            }],
            // clear temp file
            clear: ['build', (results, callback) => fs.unlink(tempPath, callback)]
        }, (err) => callback(err));
    }

    /**
     * Get the externals config by libsConfig
     * @param {Object} libsConfig - libs' packing config
     * @return {[Object]} - the externals
     * @static
     */
    static getExternals (libsConfig) {
        const libs = _.get(libsConfig, 'libs', []);
        const globalField = _.get(libsConfig, 'globalField', 'WEBPACK_2B');

        const externals = {};
        _.forEach(libs, (lib) => {
            externals[lib.expose] = `${ globalField }['${ lib.expose }']`;
        });

        return externals;
    }

    /**
     * @param {Object} pagesConfig - pages' packing config
     * @param {Array} pagesConfig.pages - the config array, each item is the config of a page
     * @param {Array} pagesConfig.[pages].src - the source path of the page
     * @param {String} pagesConfig.[pages].name - the file name of the page
     * @param {Object} pagesConfig.externals - the externals lib which will not be packed into the dest file
     * @param {String} pagesConfig.destDir - the save directory of the page
     * @param {Object} webpackConfig - custom webpack config except entry, output and externals
     * @param {Function} callback - callback function
     */
    static pagesPack (pagesConfig, webpackConfig, callback) {
        if (typeof webpackConfig === 'function') {
            callback = webpackConfig;
            webpackConfig = {};
        }

        let destDir = pagesConfig.destDir;
        if (!path.isAbsolute(destDir)) {
            destDir = path.join(process.cwd(), pagesConfig.destDir);
        }

        const pages = pagesConfig.pages;
        const externals = pagesConfig.externals;

        const entry = {};
        _.forEach(pages, (page, callback) => {
            entry[page.name] = page.src;
        });

        webpack(_.defaults({
            entry: entry,
            externals: externals,
            output: {
                path: destDir,
                filename: '[name].js'
            }
        }, webpackConfig), callback);
    }
}

module.exports = Webpack2B;