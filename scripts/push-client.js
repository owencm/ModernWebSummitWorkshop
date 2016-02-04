/*
  Copyright 2015 Google Inc. All Rights Reserved.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
  Copyright 2015 Google Inc. All Rights Reserved.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
/* eslint-env browser */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _clientPushClient = require('./client/push-client');

var _clientPushClient2 = _interopRequireDefault(_clientPushClient);

window.goog = window.goog || {};
window.goog.propel = window.goog.propel || {};
window.goog.propel.Client = _clientPushClient2['default'];

},{"./client/push-client":3}],2:[function(require,module,exports){
/*
  Copyright 2015 Google Inc. All Rights Reserved.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
/* eslint-env browser */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Endpoint = (function () {
  function Endpoint(url) {
    _classCallCheck(this, Endpoint);

    this.url = url;
  }

  _createClass(Endpoint, [{
    key: 'send',
    value: function send(message) {
      return fetch(this.url, {
        method: 'post',
        body: JSON.stringify(message),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }]);

  return Endpoint;
})();

exports['default'] = Endpoint;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
/*
  Copyright 2015 Google Inc. All Rights Reserved.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
/* eslint-env browser */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _subscriptionFailedError = require('./subscription-failed-error');

var _subscriptionFailedError2 = _interopRequireDefault(_subscriptionFailedError);

var _endpoint = require('./endpoint');

var _endpoint2 = _interopRequireDefault(_endpoint);

// document.currentScript is not supported in all browsers, but it IS supported
// in all browsers that support Push.
// TODO(mscales): Ensure that this script will not cause errors in unsupported
// browsers.
var currentScript = document.currentScript.src;

var SUPPORTED = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window && 'showNotification' in ServiceWorkerRegistration.prototype;
// Make the dummy service worker scope be relative to the library script. This
// means that you can have multiple projects hosted on the same origin without
// them interfering with each other, as long as they each use a different URL
// for the script.
var SCOPE = new URL('./goog.push.scope/', currentScript).href;
var WORKER_URL = new URL('./worker.js', currentScript).href;

var messageHandler = function messageHandler(event) {};

var registrationReady = function registrationReady(registration) {
  if (registration.active) {
    return Promise.resolve(registration.active);
  }

  var serviceWorker = registration.installing || registration.waiting;

  return new Promise(function (resolve, reject) {
    // Because the Promise function is called on next tick there is a
    // small chance that the worker became active already.
    if (serviceWorker.state === 'activated') {
      resolve(serviceWorker);
    }
    var stateChangeListener = function stateChangeListener(event) {
      if (serviceWorker.state === 'activated') {
        resolve(serviceWorker);
      } else if (serviceWorker.state === 'redundant') {
        reject(new Error('Worker became redundant'));
      } else {
        return;
      }
      serviceWorker.removeEventListener('statechange', stateChangeListener);
    };
    serviceWorker.addEventListener('statechange', stateChangeListener);
  });
};

var PushClient = (function () {
  function PushClient() {
    var _this = this;

    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$endpointUrl = _ref.endpointUrl;
    var endpointUrl = _ref$endpointUrl === undefined ? null : _ref$endpointUrl;
    var _ref$userId = _ref.userId;
    var userId = _ref$userId === undefined ? null : _ref$userId;
    var _ref$workerUrl = _ref.workerUrl;
    var workerUrl = _ref$workerUrl === undefined ? WORKER_URL : _ref$workerUrl;
    var _ref$scope = _ref.scope;
    var scope = _ref$scope === undefined ? SCOPE : _ref$scope;

    _classCallCheck(this, PushClient);

    if (!PushClient.supported()) {
      throw new Error('Your browser does not support the web push API');
    }

    this.endpoint = endpointUrl ? new _endpoint2['default'](endpointUrl) : null;
    this.userId = userId;
    this.workerUrl = workerUrl;
    this.scope = scope;

    // It is possible for the subscription to change in between page loads. We
    // should re-send the existing subscription when we initialise (if there is
    // one)
    if (this.endpoint) {
      // TODO: use requestIdleCallback when available to defer to a time when we
      // are less busy. Need to fallback to something else (rAF?) if rIC is not
      // available.
      this.getSubscription().then(function (subscription) {
        if (subscription) {
          _this.endpoint.send({
            action: 'subscribe',
            subscription: subscription,
            userId: _this.userId
          });
        }
      });
    }
  }

  _createClass(PushClient, [{
    key: 'subscribe',
    value: _asyncToGenerator(function* () {
      // Check for permission
      var permission = yield this.requestPermission();

      if (permission === 'denied') {
        throw new _subscriptionFailedError2['default']('denied');
      } else if (permission === 'default') {
        throw new _subscriptionFailedError2['default']('dismissed');
      }

      // Make sure we have a service worker and subscribe for push
      var reg = yield navigator.serviceWorker.register(this.workerUrl, {
        scope: this.scope
      });
      yield registrationReady(reg);
      var sub = yield reg.pushManager.subscribe({ userVisibleOnly: true })['catch'](function (err) {
        // This is provide a more helpful message when work with Chrome + GCM
        var errorToThrow = err;
        if (err.message === 'Registration failed - no sender id provided') {
          errorToThrow = new _subscriptionFailedError2['default']('nogcmid');
        }
        throw errorToThrow;
      });

      // Set up message listener for SW comms
      navigator.serviceWorker.addEventListener('message', messageHandler);

      if (this.endpoint) {
        // POST subscription details
        this.endpoint.send({
          action: 'subscribe',
          subscription: sub,
          userId: this.userId
        });
      }

      return sub;
    })
  }, {
    key: 'unsubscribe',
    value: _asyncToGenerator(function* () {
      var registration = yield this.getRegistration();
      var subscription = undefined;

      if (registration) {
        subscription = yield registration.pushManager.getSubscription();

        if (subscription) {
          yield subscription.unsubscribe();
        }
      }

      if (this.endpoint) {
        // POST subscription details
        this.endpoint.send({
          action: 'unsubscribe',
          subscription: subscription,
          userId: this.userId
        });
      }
    })
  }, {
    key: 'getRegistration',
    value: _asyncToGenerator(function* () {
      var reg = yield navigator.serviceWorker.getRegistration(this.scope);

      if (reg && reg.scope === this.scope) {
        return reg;
      }
    })
  }, {
    key: 'getSubscription',
    value: _asyncToGenerator(function* () {
      var registration = yield this.getRegistration();

      if (!registration) {
        return;
      }

      return registration.pushManager.getSubscription();
    })
  }, {
    key: 'requestPermission',
    value: _asyncToGenerator(function* () {
      return new Promise(function (resolve) {
        return Notification.requestPermission(resolve);
      });
    })
  }], [{
    key: 'supported',
    value: function supported() {
      return SUPPORTED;
    }
  }, {
    key: 'hasPermission',
    value: function hasPermission() {
      return Notification.permission === 'granted';
    }
  }]);

  return PushClient;
})();

exports['default'] = PushClient;
module.exports = exports['default'];

},{"./endpoint":2,"./subscription-failed-error":4}],4:[function(require,module,exports){
/*
  Copyright 2015 Google Inc. All Rights Reserved.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MESSAGES = {
  'not supported': 'Your browser doesn\'t support push messaging.',
  'denied': 'The user denied permission to show notifications.',
  'dismissed': 'The user dismissed the notification permission dialog.',
  'endpoint': 'No endpoint URL specified.',
  'nogcmid': 'Please ensure you have a Web App Manifest with ' + 'a "gcm_sender_id" defined.'
};

var SubscriptionFailedError = (function (_Error) {
  _inherits(SubscriptionFailedError, _Error);

  function SubscriptionFailedError(type) {
    _classCallCheck(this, SubscriptionFailedError);

    _get(Object.getPrototypeOf(SubscriptionFailedError.prototype), 'constructor', this).call(this);
    this.message = 'Subscription failed. ' + MESSAGES[type];
    this.type = type;
  }

  return SubscriptionFailedError;
})(Error);

exports['default'] = SubscriptionFailedError;
module.exports = exports['default'];

},{}]},{},[1]);
