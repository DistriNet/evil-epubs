"use strict";

function check_fingerprint(this_fingerprint) {
  var lowest_dist = Infinity;
  var best_fingerprints = [];

  for (var _i = 0, _Object$keys = Object.keys(fingerprints); _i < _Object$keys.length; _i++) {
    var fingerprint = _Object$keys[_i];
    var dist = calculate_hamming(this_fingerprint, fingerprint, lowest_dist);
    lowest_dist = dist;
    best_fingerprints.push({
      fingerprint: fingerprint,
      browsers: fingerprints[fingerprint],
      hamming_dist: dist,
      hamming_percentage: dist / (fingerprint.length * 4) * 100 // Multiplied by 4 to account for hexadecimal/binary

    });
  }

  best_fingerprints.sort(function (first, second) {
    return first.hamming_dist - second.hamming_dist;
  });
  return best_fingerprints;
}

function calculate_hamming(str1, str2) {
  if (str1.length != str2.length) {
    throw Error("Length of strings is not equal (" + str1.length + " vs " + str2.length + "),\n" + str1 + "\n" + str2);
  }

  var hamming = 0;

  for (var i = 0; i < str1.length; i++) {
    if (str1.charAt(i) != str2.charAt(i)) {
      // Convert hexadecimal char to bits
      var bits1 = parseInt(str1.charAt(i), 16).toString(2);
      var bits2 = parseInt(str2.charAt(i), 16).toString(2);

      for (var j = 0; j < bits1.length; j++) {
        if (bits1.charAt(j) != bits2.charAt(j)) {
          hamming++;
        }
      }
    }
  }

  return hamming;
}
