document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.executeScript(activeTab.id, {
            file: 'inject.js'
        });
    });

    var createNoteButton = document.getElementById('buttons').childNodes[1];
    console.log(docFrame);
    createNoteButton.addEventListener('click', function () {
        var noteTaker = document.getElementById('docFrame');
        var docURL = "https://docs.google.com/document/create"
        noteTaker.src = docURL;

    }, false);
}, false);
