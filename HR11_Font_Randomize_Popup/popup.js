var urlDictionary = {
    "https://www.youtube.com/watch?v=NToJdVVw0fs": 'https://docs.google.com/document/d/13DOOMgyOzVH6xpvJ2Rj9-viCKProFRAXAETTZaq-zhM/edit'
}

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


        iframeDoc = document.getElementById('docFrame').contentWindow.document;
        console.log(iframeDoc.location.href);
    }, false);
}, false);
