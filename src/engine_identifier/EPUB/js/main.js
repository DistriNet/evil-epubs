"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ignoreDeprecatedElements = false;
var ignoreDeprecatedAttributes = false;
var iterative_data = {};
var best_fingerprints;

function run() {
  try {
    console.log("Start");
    document.getElementById("progress_box").style.background = "yellow";
    var element_support = HTMLElementSupport();
    var api_support = JsApiSupport();
    var element_support_number = convert_to_number(element_support);
    var api_support_number = convert_to_number(api_support);
    var fingerprint = element_support_number + "+" + api_support_number;
    document.getElementById("fingerprint").innerHTML = fingerprint;
    //fill_iterative_table();
    fill_hidden_fields();
    console.log("Done");
    document.getElementById("progress_box").style.background = "green";
    var progress_elem = document.getElementById("progress");
    progress_elem.innerHTML = "OK";
  } catch (err) {
    // Show logs on webpage
    var logs = document.getElementById("log");
    var p = document.createElement("p");
    p.innerHTML = err.message;
    logs.appendChild(p);
    var p2 = document.createElement("p");
    p2.innerHTML = err.stack;
    logs.appendChild(p2);
    logs.style.visibility = "";
    document.getElementById("progress_box").style.background = "red";
    console.log("Ended due to error");
    var progress_elem = document.getElementById("progress");
    progress_elem.innerHTML = "ERROR";
  }

  best_fingerprints = check_fingerprint(fingerprint); // Take the 5 best best_fingerprints

  var fingerprint_table = [];
  fingerprint_table.push(["Browser engine", "Hamming distance", "Hamming distance (%)"]);

  for (var i = 0; i < 5; i++) {
    fingerprint_table.push([best_fingerprints[i].browsers, best_fingerprints[i].hamming_dist, best_fingerprints[i].hamming_percentage]);
  }

  document.getElementById("best_fingerprints").appendChild(createTable(fingerprint_table));
  document.getElementById("user-agent").innerHTML = navigator.userAgent;
}

function fill_iterative_table() {
  var table = document.getElementById("browser_table"); // Table header

  var header = document.createElement("tr");
  header.innerHTML = "<th>Browser</th><th>Version</th><th>Engine</th>";
  table.appendChild(header);

  for (var browser in iterative_data) {
    var versions = iterative_data[browser].to_list();
    var engines = iterative_data[browser].to_engine_list();

    if (versions.length > 0) {
      var new_row = document.createElement("tr");
      new_row.innerHTML = "<th>" + browser + "</th><th>" + versions.join(" -> ") + "</th><th>" + engines.join(" -> ") + "</th>";
      table.appendChild(new_row);
    } else {
      var new_row = document.createElement("tr");
      new_row.innerHTML = "<th>" + browser + "</th><th> - </th><th> - </th>";
      table.appendChild(new_row);
    }
  }
}

function fill_hidden_fields() {
  var data_element = document.getElementById("data");

  for (var browser in iterative_data) {
    var versions = iterative_data[browser].to_list();

    if (versions.length > 0) {
      var new_row = document.createElement("p");
      new_row.innerHTML = browser + ": " + versions.join(" -> ");
      data_element.appendChild(new_row);
    } else {
      var new_row = document.createElement("p");
      new_row.innerHTML = browser + ": -";
      data_element.appendChild(new_row);
    }
  }
}

function convert_to_number(support_list) {
  // Always include a leading '1' bit such that '0000' won't be truncated when converted to hexadecimal
  var bin_string = "1";

  var _iterator = _createForOfIteratorHelper(support_list),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var tuple = _step.value;

      if (tuple[1]) {
        bin_string += 1;
      } else {
        bin_string += 0;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return parseBigInt(bin_string, 2).toString(16); //return btoa(bin_string);
}

function parseBigInt(str) {
  var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  base = bigInt(base);
  var bigint = bigInt(0);

  for (var i = 0; i < str.length; i++) {
    var code = str[str.length - 1 - i].charCodeAt(0) - 48;
    if (code >= 10) code -= 39;
    bigint = bigint.add(base.pow(bigInt(i)).multiply(bigInt(code)));
  }

  return bigint;
}
/*
    Functions related to iterative data structure
*/


function add_to_iterative_data(data) {
  for (var _i = 0, _Object$keys = Object.keys(data); _i < _Object$keys.length; _i++) {
    var browser = _Object$keys[_i];

    // Add browser to iterative data if not already present
    if (Object.keys(iterative_data).indexOf(browser) < 0) {
      iterative_data[browser] = new VersionSet(browser);
    }

    if ("version_added" in data[browser]) {
      var version_added = data[browser]["version_added"]; // If no information is available, nothing should change

      if (version_added == null) {
        return; // If all browser versions offer support, nothing must be added
      } else if (version_added == true) {
        return; // If no browser version offers support, change to empty list
      } else if (version_added == false) {
        iterative_data[browser].exclude_all();
      } else if (!isNaN(parseInt(version_added))) {
        iterative_data[browser].exclude_until(parseInt(version_added));
      } else {
        console.log("Could not identify 'version_added': " + data[browser]["version_added"]);
      }
    }

    if ("version_removed" in data[browser]) {
      var version_removed = data[browser]["version_removed"]; // If no information is available, nothing should change

      if (version_removed == null) {
        return; // If all browser versions offer support, nothing must be added
      } else if (version_removed == true) {
        console.log("IMPORTANT: version_removed was true"); // If no browser version offers support, change to empty list
      } else if (version_removed == false) {
        console.log("IMPORTANT: version_removed was false");
      } else if (!isNaN(parseInt(version_removed))) {
        iterative_data[browser].exclude_from(parseInt(version_removed) - 1);
      } else {
        console.log("Could not identify 'version_added': " + data[browser]["version_added"]);
      }
    }
  }
} // Chrome: rtc, menu, listing, dir, basefront
// Safari: data


var ignoredElements = []; //["rtc", "menu", "listing", "data", "dir", "basefont"];

var ignoredAttributes = {};
/* {
"form": ["autocapitalize"],
"link": ["sizes"],
"textarea": ["autocomplete", "autocapitalize"]
}*/

function HTMLElementSupport() {
  var result = [];
  var i_elements = 0;
  var n_elements = 0;
  var deprecated_elements = 0;
  var i_attributes = 0;
  var n_attributes = 0;
  var deprecated_attributes = 0;

  for (var element in html_elements["html"]["elements"]) {
    n_elements++; // Check whether to ignore deprecated elements

    if (ignoreDeprecatedElements == true && html_elements["html"]["elements"][element]["__compat"]["status"]["deprecated"] == true) {
      deprecated_elements++;
      continue;
    }

    if (ignoredElements.indexOf(element) >= 0) {
      continue;
    } // Check whether HTML element is supported


    if (supportsElement(element)) {
      add_to_iterative_data(html_elements["html"]["elements"][element]["__compat"]["support"]);
      result.push([element, true]);
    } else {
      result.push([element, false]);
    } // Check whether attribute information is included


    for (var key in html_elements["html"]["elements"][element]) {
      if (key == "__compat") {
        continue;
      }

      n_attributes++; // Check whether to ignore deprecated attributes

      if (ignoreDeprecatedAttributes == true && html_elements["html"]["elements"][element][key]["__compat"]["status"]["deprecated"] == true) {
        deprecated_attributes++;
        continue;
      }

      if (element in ignoredAttributes && ignoredAttributes[element].indexOf(key) >= 0) {
        continue;
      } // Check whether the key stands for an attribute


      if (key.indexOf("_") < 0) {
        if (supportsElementAttribute(element, key)) {
          if ("__compat" in html_elements["html"]["elements"][element][key]) {
            add_to_iterative_data(html_elements["html"]["elements"][element][key]["__compat"]["support"]);
            result.push([element + "_" + key, true]);
          } else {
            console.log("No '__compat' found for " + element + " + " + key);
            continue;
          }
        } else {
          result.push([element + "_" + key, false]);
        }
      }

      i_attributes++;
    }

    i_elements++;
  }

  console.log("Checked " + i_elements + "/" + n_elements + " supported HTML elements");
  console.log("Ignored " + deprecated_elements + " deprecated elements");
  console.log("Checked " + i_attributes + "/" + n_attributes + " supported HTML element attributes");
  console.log("Ignored " + deprecated_attributes + " deprecated attributes");
  return result;
}

var ignoredAPIs = []; //["RTCRtpTransceiver", "AuthenticatorAssertionResponse", "XRWebGLLayer"];

function JsApiSupport() {
  var result = [];
  var i = 0;
  var n = 0;

  for (var api in apis["api"]) {
    n++;

    if (ignoredAPIs.indexOf(api) >= 0) {
      continue;
    }

    if (supportsAPI(api)) {
      add_to_iterative_data(apis["api"][api]["__compat"]["support"]);
      result.push([api, true]);
    } else {
      result.push([api, false]);
    }

    i++;
  }

  console.log("Checked " + i + "/" + n + " supported JavaScript APIs");
  return result;
}

function supportsElement(element) {
  if (!_instanceof(document.createElement(element), HTMLUnknownElement)) {
    return true;
  } else {
    return false;
  }
}

function supportsElementAttribute(element, attribute) {
  var elem = document.createElement(element);
  return attribute in elem;
}

function supportsAPI(api) {
  return eval("window." + api) != undefined;
}

function createTable(tableData) {
  var table = document.createElement('table');
  var tableBody = document.createElement('tbody');
  tableData.forEach(function (rowData) {
    var row = document.createElement('tr');
    rowData.forEach(function (cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
  table.appendChild(tableBody);
  return table;
}

window.onload = run;
