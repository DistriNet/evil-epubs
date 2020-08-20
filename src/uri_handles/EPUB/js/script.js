// Word
function uri_handle() {
    navigate(window, "ms-word:https://wholeftopenthecookiejar.com");
    navigate(window, "https://wholeftopenthecookiejar.com");
}

function navigate(w, url) {
  var a = w.document.createElement('a');
  a.href = url;
  a.click();
}

// Camera
try {
    if (navigator.mediaDevices != undefined) {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function() {
            document.getElementById("feature_camera").innerHTML = "Permission granted";
        })
        .catch(function(err) {
            document.getElementById("feature_camera").innerHTML = "ERROR: " + err.message;
        })
    } else {
        document.getElementById("feature_camera").innerHTML = "MediaDevices not available";
    }
} catch(err) {
    document.getElementById("feature_camera").innerHTML = "ERROR: " + err.message;
}

// Microphone
try {
    if (navigator.mediaDevices != undefined) {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function() {
            document.getElementById("feature_microphone").innerHTML = "Permission granted";
        })
        .catch(function(err) {
            document.getElementById("feature_microphone").innerHTML = "ERROR: " + err.message;
        })
    } else {
        document.getElementById("feature_microphone").innerHTML = "MediaDevices not available";
    }
} catch(err) {
    document.getElementById("feature_microphone").innerHTML = "ERROR: " + err.message;
}

// Geo location
try {
    navigator.geolocation.getCurrentPosition(function(position) {
      document.getElementById("feature_geolocation").innerHTML = "Received coordinates: " + position.coords.latitude + ", " + position.coords.longitude;
  });
} catch(err) {
    document.getElementById("feature_geolocation").innerHTML = "ERROR: " + err.message;
}
