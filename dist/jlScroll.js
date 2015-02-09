var jl = jl || {};

/**
* (SERVICE) An alternative to directly calling element.on("scroll", ...),
* this service provides a more Angular-friendly way of handling scroll
* events.
*
* @namespace jlScroll
* @class scroll
* @static
* @param {Angular service} jlWindow
* @param {Angular service} util
* @param {Number} maxScrollsPerSecond
*/
jl.Scroll = function(jlWindow, $rootScope, util, maxScrollsPerSecond) {
  var _handlers = {};
  var _nextId = 0;

  /**
  * @method addCallback
  * @param {DOM Element} element
  * @param {String} id
  * @param {Function} func
  */
  this.addCallback = function(element, id, func) {
    var eid = element.get(0).id;
    if (!eid || eid.length === 0) {
      eid = element.get(0).id = "jlScroll" + _nextId++;
    }

    var handlers = _handlers[eid];

    if (!handlers || handlers.length === 0) {
      element.on("scroll", util.debounce(function(event) {
        var h = _handlers[eid];

        for (var i in h) {
          h[i](event);
        }

        $rootScope.$digest();
      }, 1000 / maxScrollsPerSecond));

      _handlers[eid] = {};
    }

    _handlers[eid][id] = func;
  };

  /**
  * @method removeCallback
  * @param {DOM Element} element
  * @param {String} id
  */
  this.removeCallback = function(element, id) {
    var eid = element.get(0).id;

    if (eid) {
      var h = _handlers[eid];

      if (h) {
        delete h[id];
      }
    }
  };

  /**
  * @method scrollTo
  * @param {DOM Element} element
  * @param {Integer} destY
  * @param {Integer} pps Pixels per second
  */
  this.scrollTo = function(element, destY, pps) {
    var h = Math.abs(destY - element.scrollTop());
    var t = h / pps;

    if (util.isWindow(element)) {
      util.element("html, body").animate({
        scrollTop: destY
      }, t * 1000);
    }
    else {
      element.animate({
        scrollTop: destY
      }, t * 1000);
    }
  };
};

/**
* Provides a way of handling scroll events in an 'Angular' fashion.
*
* @module App
* @submodule jlScroll
* @requires jlUtil
*/
angular.module("jlScroll", ["jlUtil"])

  /**
  * (PROVIDER) Provider for scroll service
  *
  * @namespace jlScroll
  * @class scrollProvider
  * @static
  */
  .provider("scroll", [function scrollProvider() {
    var self = this;
    self.maxScrollEventsPerSecond = 30;

    self.$get = ["jlWindow", "$rootScope", "util", function(jlWindow, $rootScope, util) {
      return new jl.Scroll(jlWindow, $rootScope, util, self.maxScrollEventsPerSecond);
    }];
  }])

  /**
  * (DIRECTIVE)
  *
  * @namespace jlScroll
  * @class jlScroll
  * @constructor
  * @param {Angular service} util
  * @param {Angular service} scroll
  */
  .directive("jlScroll", [
  "util", "scroll",
  function(util, scroll) {
    function link($scope, $element) {
      var e = util.element($element);
      if (e) {
        scroll.addCallback(e, "jlScroll", function(event) {
          $scope.jlScroll({event: event});
        });

        $scope.$on("$destroy", function() {
          scroll.removeCallback(e, "jlScroll");
        });
      }
    }

    return {
      restrict: 'A',
      link: link,
      scope: {
        jlScroll: '&'
      }
    };
  }]);
