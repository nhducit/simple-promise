/**
 * Created by duc on 24/11/2015.
 */
(function () {
  'use strict';
  var PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED';

  /**
   *
   * @constructor
   */
  function Promise(){
    var state = PENDING;
    var value;
    var handlers = [];
    function fulfill (resultData) {
      state = FULFILLED;
      value  = resultData;
    }

    function reject (errorData) {
      state = REJECTED;
      value = errorData;
    }

    function resolve (result) {
      try {
        var then = getThen(result);
        if(then) {
          doResolve(then.bind(result), resolve, reject);
        }
        fulfill(result);
      }catch (exception) {
        reject(exception);
      }
    }

    /**
     * check if input value is a Promise and, if it is,
     * return the `then` method of that promise
     * @param {Promise|*} value
     * @returns {Function|null}
     */
    function getThen(value){
      var valueType = typeof value;
      if(value && (valueType === 'object' || valueType === 'function')) {
        var then = value.then;
        if(typeof then === 'function') {
          return then;
        }
      }
      return null;
    }

    /**
     *
     * @param fn
     * @param onFulfilled
     * @param onRejected
     */
    function doResolve (fn, onFulfilled, onRejected) {
      var done = false;
      try {
        fn(
          function (value){
            if (done) {
              return;
            }
            done = true;
            onFulfilled(value);
          },
          function (reason) {
            if (done) {
              return;
            }
            done = true;
            onRejected(reason);

          }
        );
      } catch (exception) {
        if (done) {
          return;
        }
        done = true;
        onRejected(exception);
      }
    }
  }
})();