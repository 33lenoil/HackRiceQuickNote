var elems = document.body.getElementsByTagName("*");

for (const [key, value] of Object.entries(elems)) {
    var newFontSize = Math.floor(Math.random() * 40);
    value.style.fontSize = String(newFontSize) + 'px';
}
/* Testing */