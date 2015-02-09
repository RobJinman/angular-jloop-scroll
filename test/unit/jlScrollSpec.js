"use strict";

describe("jlScroll module", function() {
  var scrollProvider;

  beforeEach(module("jlScroll", function(_scrollProvider_, $provide) {
    $provide.value('jlWindow', new test.mockWindow());
    scrollProvider = _scrollProvider_;
    jasmine.clock().install();
  }));

  describe("scroll service", function() {
    var scroll, $timeout;

    beforeEach(inject(function(_$timeout_, $injector) {
      $timeout = _$timeout_;

      scrollProvider.maxScrollEventsPerSecond = 1;
      scroll = $injector.get("scroll");
    }));

    it("should call scroll handler only once after single scroll event", function() {
      var html =
        "<div id='container' style='height: 100px; overflow-y: scroll'>" +
        "  <div style='height: 400px'></div>" +
        "</div>";
      var element = jQuery(html);

      var obj = {
        fn: function() {}
      };

      spyOn(obj, 'fn');

      scroll.addCallback(element, "test", obj.fn);

      element.triggerHandler("scroll");

      expect(obj.fn.calls.count()).toEqual(1);

      $timeout.flush(10000);
      jasmine.clock().tick(10000);
      expect(obj.fn.calls.count()).toEqual(1);
    });

    it("should call scroll handler only twice upon a flurry of scroll events, separated by 'delay' milliseconds", function() {
      var html =
        "<div id='container' style='height: 100px; overflow-y: scroll'>" +
        "  <div style='height: 400px'></div>" +
        "</div>";
      var element = jQuery(html);

      var obj = {
        fn: function() {}
      };

      spyOn(obj, 'fn');

      scroll.addCallback(element, "test", obj.fn);

      var baseTime = new Date(2013, 9, 23);
      jasmine.clock().mockDate(baseTime);

      element.triggerHandler("scroll");
      element.triggerHandler("scroll");
      element.triggerHandler("scroll");
      element.triggerHandler("scroll");
      element.triggerHandler("scroll");

      $timeout.flush(0);
      jasmine.clock().tick(0);
      expect(obj.fn.calls.count()).toEqual(1);

      $timeout.flush(999);
      jasmine.clock().tick(999);
      expect(obj.fn.calls.count()).toEqual(1);

      $timeout.flush(1);
      jasmine.clock().tick(1);
      expect(obj.fn.calls.count()).toEqual(2);

      $timeout.flush(10000);
      jasmine.clock().tick(10000);
      expect(obj.fn.calls.count()).toEqual(2);
    });

    it("should limit callbacks to once per 'delay' milliseconds", function() {
      var html =
        "<div id='container' style='height: 100px; overflow-y: scroll'>" +
        "  <div style='height: 400px'></div>" +
        "</div>";
      var element = jQuery(html);

      var obj = {
        fn: function() {}
      };

      spyOn(obj, 'fn');

      scroll.addCallback(element, "test", obj.fn);

      var baseTime = new Date(2013, 9, 23);
      jasmine.clock().mockDate(baseTime);

      var dt = 57;
      for (var t = 0; t < 10000; t += dt) {
        element.triggerHandler("scroll");

        expect(obj.fn.calls.count()).toEqual(1 + Math.floor(t / 1000));

        $timeout.flush(dt);
        jasmine.clock().tick(dt);
      }

      $timeout.flush(100000);
      jasmine.clock().tick(100000);

      expect(obj.fn.calls.count()).toEqual(11);
    });

    it("should limit callbacks to once per 'delay' milliseconds. Multiple callbacks registered, some unregistered.", function() {
      var html =
        "<div>" +
        "  <div id='container' style='height: 100px; overflow-y: scroll'>" +
        "    <div style='height: 400px'></div>" +
        "  </div>" +
        "  <div id='other'></div>" +
        "</div>";
      var root = jQuery(html);
      var element1 = root.find("#container");
      var element2 = root.find("#other");

      var obj = {
        fn1: function() {},
        fn2: function() {},
        fn3: function() {},
        fn4: function() {}
      };

      spyOn(obj, 'fn1');
      spyOn(obj, 'fn2');
      spyOn(obj, 'fn3');
      spyOn(obj, 'fn4');

      scroll.addCallback(element1, "A", obj.fn1);
      scroll.addCallback(element2, "A", obj.fn2);
      scroll.addCallback(element1, "B", obj.fn3);
      scroll.addCallback(element2, "B", obj.fn4);
      scroll.addCallback(element1, "C", obj.fn4);

      scroll.removeCallback(element2, "B");
      scroll.removeCallback(element1, "C");

      var baseTime = new Date(2013, 9, 23);
      jasmine.clock().mockDate(baseTime);

      var dt = 57;
      for (var t = 0; t < 10000; t += dt) {
        element1.triggerHandler("scroll");

        expect(obj.fn1.calls.count()).toEqual(1 + Math.floor(t / 1000));
        expect(obj.fn3.calls.count()).toEqual(1 + Math.floor(t / 1000));

        $timeout.flush(dt);
        jasmine.clock().tick(dt);
      }

      $timeout.flush(100000);
      jasmine.clock().tick(100000);

      expect(obj.fn1.calls.count()).toEqual(11);
      expect(obj.fn2).not.toHaveBeenCalled();
      expect(obj.fn3.calls.count()).toEqual(11);
      expect(obj.fn4).not.toHaveBeenCalled();
    });
  });

  describe("jlScroll directive", function() {
    it("should register a callback with the scroll service", inject(function($compile, $rootScope) {
      var scope = $rootScope.$new();
      scope.fn = function() {};

      spyOn(scope, 'fn');

      var html =
        "<div jl-scroll='fn(event)' id='container' style='height: 100px; overflow-y: scroll'>" +
        "  <div style='height: 400px'></div>" +
        "</div>";
      var element = jQuery($compile(html)(scope));

      element.triggerHandler("scroll");

      expect(scope.fn).toHaveBeenCalled();
      expect(scope.fn.calls.argsFor(0)[0].type).toEqual("scroll");
    }));
  });
});
