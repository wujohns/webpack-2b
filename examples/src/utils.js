/**
 * custom utils
 *
 * @author wujohns
 * @date 17/8/8
 */
'use strict';

import _ from 'lodash';

const BBUtils = {
    test: function () {
        _.forEach([1, 2, 3], function (val) {
            console.log(val);
        });
    }
}

export default BBUtils;