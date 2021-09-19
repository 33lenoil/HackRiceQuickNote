var docUrl = document.querySelector('meta[itemprop="url"]').content;
console.log(docUrl);


chrome.runtime.sendMessage({ "url": docUrl, 'msg': 'docURL' });
