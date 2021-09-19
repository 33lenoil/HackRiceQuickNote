var ytplayer = document.querySelector('video');
ytplayer.pause();
/* Testing */
ytplayer = document.getElementById("movie_player");

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.requestTime) {
            var ytplayer = document.querySelector('video');
            ytplayer.pause();
            setTimeout(function () {
                var time = document.getElementsByClassName("ytp-time-current")[0].innerHTML;
                chrome.runtime.sendMessage({ timeStamp: toSeconds(time), url: window.location.href, ytTime: true }, function () {
                    console.log("success");
                });
                ytplayer.play();
            }, 2);

        }
        if (request.url) {
            chrome.runtime.sendMessage({ url: window.location.href, getURL: true }, function () {
                console.log("success");
            });
        }
    }
);

function toSeconds(time) {
    var array = time.split(":");
    switch (array.length) {
        case 2:
            return Number(array[0]) * 60 + Number(array[1]) + 's';
        case 3:
            return Number(array[0]) * 3600 + Number(array[1] * 60) + Number(array[0]) + 's';
        default:
            return Number(array[0]) * 86400 + Number(array[1]) * 3600 + Number(array[2]) * 60 + Number(array[3]) + 's';
    }
}
