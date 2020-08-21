"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VersionSet = /*#__PURE__*/function () {
  function VersionSet(browser) {
    _classCallCheck(this, VersionSet);

    this.browser = browser; // Lower and upper bound are included in set.

    this.lower = 1;
    this.upper = Infinity;
    this.all_excluded = false;
  }

  _createClass(VersionSet, [{
    key: "exclude_until",
    value: function exclude_until(version) {
      if (this.lower < version) {
        this.lower = version;
      }
    }
  }, {
    key: "exclude_from",
    value: function exclude_from(version) {
      if (this.upper > version) {
        this.upper = version;
      }
    }
  }, {
    key: "exclude_all",
    value: function exclude_all() {
      this.all_excluded = true;
    }
  }, {
    key: "to_list",
    value: function to_list() {
      if (this.lower > this.upper || this.all_excluded) {
        return [];
      } else if (this.upper == Infinity) {
        return [this.lower, Infinity];
      } else {
        var list = [];

        for (var i = this.lower; i <= this.upper; i++) {
          list.push(i);
        }

        return list;
      }
    }
  }, {
    key: "to_engine_list",
    value: function to_engine_list() {
      var browser = this.browser;

      if (browser == "samsunginternet_android") {
        return ["NS"];
      } else if (browser == "webview_android") {
        return ["NS"];
      } else if (browser == "opera_android") {
        return ["NS"];
      } else if (browser == "safari_ios") {
        return ["NS"];
      } else if (browser == "chrome_android") {
        return ["NS"];
      } else if (browser == "nodejs") {
        return ["NS"];
      }

      return this.to_list().map(function (version) {
        if (version == Infinity) {
          return Infinity;
        } else {
          return get_associated_engine(browser, version);
        }

        function get_associated_engine(browser, version) {
          if (browser == "chrome") {
            if (version <= 0) {
              throw "Invalid version";
            } else if (0 < version && version < 28) {
              return {
                1: "WebKit 258",
                2: "WebKit 530",
                3: "WebKit 532",
                4: "WebKit 532.5",
                5: "WebKit 533",
                6: "WebKit 534.3",
                7: "WebKit 534.7",
                8: "WebKit 534.10",
                9: "WebKit 534.13",
                10: "WebKit 534.16",
                11: "WebKit 534.24",
                12: "WebKit 534.30",
                13: "WebKit 535.1",
                14: "WebKit 535.1",
                15: "WebKit 535.2",
                16: "WebKit 535.7",
                17: "WebKit 535.11",
                18: "WebKit 535.19",
                19: "WebKit 536.5",
                20: "WebKit 536.10",
                21: "WebKit 537.1",
                22: "WebKit 537.4",
                23: "WebKit 537.11",
                24: "WebKit 537.17",
                25: "WebKit 537.22",
                26: "WebKit 537.31",
                27: "WebKit 537.36"
              }[version];
            } else {
              return "Blink " + version;
            }
          } else if (browser == "firefox") {
            if (version <= 0) {
              throw "Invalid version";
            } else if (version < 5) {
              return {
                1: "Gecko 1",
                2: "Gecko 1",
                3: "Gecko 1",
                4: "Gecko 2"
              }[version];
            } else {
              return "Gecko " + version;
            }
          } else if (browser == "ie") {
            if (version <= 0) {
              throw "Invalid version";
            } else if (version < 8) {
              return "Trident (< 3.1)";
            } else {
              return {
                8: "Trident 4.0",
                9: "Trident 5.0",
                10: "Trident 6.0",
                11: "Trident 7.0/8.0"
              }[version];
            }
          } else if (browser == "edge") {
            if (version <= 0) {
              throw "Invalid version";
            } else if (version < 45) {
              return {
                20: "EdgeHTML 12",
                25: "EdgeHTML 13",
                38: "EdgeHTML 14",
                40: "EdgeHTML 15",
                41: "EdgeHTML 16",
                42: "EdgeHTML 17",
                43: "EdgeHTML 17",
                44: "EdgeHTML 18"
              }[version];
            } else if (version < 79) {
              throw "Invalid Edge version";
            } else {
              return "Blink " + version;
            }
          } else if (browser == "opera") {
            if (version <= 0) {
              throw "Invalid version";
            } else if (version < 20) {
              throw "Invalid Opera version";
            } else {
              return "Blink " + (version + 13);
            }
          } else if (browser == "safari") {
            if (version <= 0) {
              throw "Invalid version";
            } else {
              return {
                1: "WebKit 85",
                2: "WebKit 412",
                3: "WebKit 522.11",
                4: "WebKit 530.17",
                5: "WebKit 533.16",
                6: "WebKit 536.25",
                7: "WebKit 537.71",
                8: "WebKit 538.35.8",
                9: "WebKit 601.1.56",
                10: "WebKit 602.1.50",
                11: "WebKit 604.2.4",
                12: "WebKit 606.1.36"
              }[version];
            }
          } else {
            throw new Error("Browser not defined");
          }
        }
      });
    }
  }]);

  return VersionSet;
}();
