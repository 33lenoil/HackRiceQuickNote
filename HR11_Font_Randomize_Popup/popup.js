document.addEventListener('DOMContentLoaded', function(){
    var changeFontButton = document.getElementById('changeFont');
    changeFontButton.addEventListener('click', function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.executeScript(activeTab.id, {
                file: 'inject.js'
            });
        });
    }, false);
}, false);
