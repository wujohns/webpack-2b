/**
 * home page
 *
 * @author wujohns
 * @date 17/8/8
 */

import async from 'async';

async.map([1000, 2000, 3000], function (delay, callback) {
    setTimeout(function () {
        console.log(delay);
        return callback(null, delay);
    }, delay);
}, function (err, results) {
    console.log(results);
});