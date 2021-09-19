document.addEventListener('DOMContentLoaded', function () {

    /*fetch("mapping.json")
    .then(response => response.json())
    .then(json => console.log(json));*/

    var curURL;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        curURL = activeTab.url;
        console.log(curURL);
        chrome.tabs.executeScript(activeTab.id, {
            file: 'inject.js',
        });
    });


    var createNoteButton = document.getElementById('buttons').childNodes[1];
    createNoteButton.addEventListener('click', function () {


        chrome.tabs.create({ 'url': "https://docs.google.com/document/create", 'active': false },
            myTab => {
                function listener(tabId, changeInfo, tab) {
                    // make sure the status is 'complete' and it's the right tab
                    if (tabId === myTab.id && changeInfo.status == 'complete') {
                        chrome.tabs.executeScript(myTab.id, function (myTab) {
                            file: 'getDocUrl.js'
                        });
                        chrome.tabs.onUpdated.removeListener(listener);
                    }
                };


            });


        var docURL;
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                console.log('success');
                console.log(request);
                console.log(request.msg);

                if (request.url && request.msg === 'docURL') {
                    console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");

                    docURL = sender.tab.url;
                    console.log(docURL);
                    var noteTaker = document.getElementById('docFrame');
                    noteTaker.src = docURL;
                }

            }
        );
    }, false);

    var timeButton = document.getElementById('timeStamp');
    timeButton.addEventListener('click', function () {
        var time = "0";
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { requestTime: true }, function () { });

            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {
                    if (request.ytTime) {
                        console.log(sender.tab ?
                            "from a content script:" + sender.tab.url :
                            "from the extension");
                        console.log(request.timeStamp);
                        time = request.timeStamp;
                        var timeLink = document.getElementById('timeLink');
                        if (request.url.includes("&t=")) {
                            timeLink.href = request.url.substring(0, request.url.indexOf("&t=")) + "&t=" + time;
                        } else {
                            timeLink.href = request.url + "&t=" + time;
                        }
                        console.log(timeLink.href);
                        navigator.clipboard.writeText(timeLink.href).then(function () { }, function () { });
                        timeLink.innerHTML = "Link Copied into Clipboard";
                    }

                }
            );
        });
    });

    var transcriptButton = document.getElementById('button3');
    transcriptButton.addEventListener('click', function () {
        var curURL = '';
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { url: true }, function () { });
            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {
                    if (request.getURL) {
                        console.log(request.url);
                        curURL = request.url;
                        console.log(curURL);
                        if (curURL.includes("&t=")) {
                            curURL = curURL.substring(0, curURL.indexOf("&t="));
                        }
                        videoID = curURL.split('=')[1];
                        console.log(videoID);
                        transcriptButton.innerHTML = videoID;
                        navigator.clipboard.writeText(transcriptButton.innerHTML).then(function () { }, function () { });
                    }
                }
            );
        });
    });

}, false);


