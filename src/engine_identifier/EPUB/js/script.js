function detect_js() {
    try {
        var js_entry = document.getElementById("js-inline-entry");
        js_entry.innerHTML = "Yes";
        js_entry.style.color = "green";

        var version_entry = document.getElementById("js-appversion-entry");
        version_entry.innerHTML = navigator.appVersion;

        var readingsystem_entry = document.getElementById("js-readingsystem-entry");
        if (navigator.epubReadingSystem != 'undefined') {
            readingsystem_entry.innerHTML = navigator.epubReadingSystem;
        }
    } catch(err) {
        alert("ERROR: " + err.message);
        var logs = document.getElementById("logs");
        var log = document.createElement("p");
        log.innerHTML = err.message;
        logs.appendChild(log);
    }
}

function main() {
    var exampleElement = document.getElementById("hello");
    exampleElement.addEventListener('click', handleClick, false);
    exampleElement.addEventListener('touchend', handleTouch, false);
    function handleClick(event) {
        event.preventDefault();
    }
    function handleTouch(event) {
        exampleElement.style.background="red";
        event.preventDefault();
    }

    detect_js();
}

window.onload = main;
main();
