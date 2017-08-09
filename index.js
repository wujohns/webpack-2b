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

                // 包的引入以及文件内容拼接
                _.forEach(libs, (lib) => {
                    // 在临时文件中的 import 路径
                    const libSrc = Webpack2B._getResolvePath(lib.src, saveDir);
                    const libVarName = `${ globalField }_${ stringHash(lib.expose).toString(36) }`;
                    tempFileContent = `
                        ${ tempFileContent }
                        import ${ libVarName } from '${ libSrc }';
                        window.${ globalField }['${ lib.expose }'] = ${ libVarName };
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
                webpack(_.defaults({
                    entry: tempPath,
                    output: {
                        path: saveDir,
                        filename: `${ saveBasename }${ saveExtname }`
                    }
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
     * @param {Array} pagesConfig.[pages].src - the source path of the pages
     * @param {String} pagesConfig.[pages].dest - the custom name of the page
     * @param {Object} pagesConfig.externals - the externals lib which will not be packed into the dest file
     * @param {Object} webpackConfig - custom webpack config except entry, output and externals
     * @param {Function} callback - callback function
     */
    static pagesPack (pagesConfig, webpackConfig, callback) {
        if (typeof webpackConfig === 'function') {
            callback = webpackConfig;
            webpackConfig = {};
        }

        const pages = pagesConfig.pages;
        const externals = pagesConfig.externals;

        async.map(pages, (page, callback) => {
            let pageDest = page.dest;
            if (!path.isAbsolute(pageDest)) {
                pageDest = path.join(process.cwd(), pageDest);
            }

            const pageDestDir = path.dirname(pageDest);
            const pageExtname = path.extname(pageDest);
            const pageBasename = path.basename(pageDest, pageExtname);

            const entry = {};
            entry[pageBasename] = page.src;

            webpack(_.defaults({
                entry: entry,
                externals: pagesConfig.externals,
                output: {
                    path: pageDestDir,
                    filename: '[name].js'
                }
            }, webpackConfig), callback);
        }, (err) => callback(err));
    }
}

module.exports = Webpack2B;