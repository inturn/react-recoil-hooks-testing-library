'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var reactHooks = require('@testing-library/react-hooks');
var React = _interopDefault(require('react'));
var recoil = require('recoil');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function recoilStateWrapper(options) {
    return function (props) {
        var renderChildren = (options === null || options === void 0 ? void 0 : options.wrapper) ? (React.createElement(options.wrapper, __assign({}, props))) : (props.children);
        return (React.createElement(recoil.RecoilRoot, { initializeState: function (_a) {
                var _b;
                var set = _a.set;
                (_b = options === null || options === void 0 ? void 0 : options.states) === null || _b === void 0 ? void 0 : _b.forEach(function (_a) {
                    var recoilState = _a.recoilState, initialValue = _a.initialValue;
                    set(recoilState, initialValue);
                });
            } }, renderChildren));
    };
}
function renderRecoilHook(callback, options) {
    return reactHooks.renderHook(callback, __assign(__assign({}, options), { wrapper: recoilStateWrapper({
            states: options === null || options === void 0 ? void 0 : options.states,
            wrapper: options === null || options === void 0 ? void 0 : options.wrapper,
        }) }));
}

Object.defineProperty(exports, 'act', {
    enumerable: true,
    get: function () {
        return reactHooks.act;
    }
});
exports.renderRecoilHook = renderRecoilHook;
