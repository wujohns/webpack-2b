/**
 * mocha test
 *
 * @author wujohns
 * @date 17/8/9
 */
'use strict';

const fs = require('fs');
const path = require('path');
const should = require('chai').should();
const webpack2b = require('../index.js');

describe('build', () => {
    const libsConfig = {
        libs: [
            { src: 'async', expose: 'async' },
            { src: 'lodash', expose: 'lodash' },
            { src: './examples/src/utils.js', expose: 'bbutils' }
        ],
        savePath: './test/libs.js'
    };

    const pagesConfig = {
        pages: [
            { src: ['./examples/src/home.js'], dest: './test/home.js' },
            { src: ['./examples/src/profile.js'], dest: './test/profile.js' }
        ],
        externals: webpack2b.getExternals(libsConfig)
    };

    it('libsPack', (done) => {
        webpack2b.libsPack(libsConfig, {}, (err) => {
            should.not.exist(err);
            return done();
        });
    });

    it('pagesPack', (done) => {
        webpack2b.pagesPack(pagesConfig, {}, (err) => {
            should.not.exist(err);
            return done();
        });
    });

    it('getExternals', (done) => {
        try {
            webpack2b.getExternals(libsConfig);
        } catch (err) {
            should.not.exist(err);
        }
        return done();
    });

    after((done) => {
        try {
            fs.unlinkSync(path.join(__dirname, './home.js'));
            fs.unlinkSync(path.join(__dirname, './profile.js'));
            fs.unlinkSync(path.join(__dirname, './libs.js'));
        } catch (err) {
            should.not.exist(err);
        }
        return done();
    });
});