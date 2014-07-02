var pShoreStatus = new Object;
var pTargetFrame = document;
pShoreStatus.name = pTargetFrame.links[0].innerHTML;
pShoreStatus.number = 0;
pShoreStatus.tileID = pTargetFrame.getElementsByTagName('SCRIPT')[0].textContent;
pShoreStatus.tileID = pShoreStatus.tileID.slice(pShoreStatus.tileID.lastIndexOf(' ') + 1, pShoreStatus.tileID.lastIndexOf(';'));
console.log("Building ID: " + pShoreStatus.tileID);
var names = pTargetFrame.getElementsByTagName('B');
console.log(names.length);
for (var i=0;i<names.length;i++) {
    if (names[i].textContent.search("'s") != -1) {
        pShoreStatus.owner = names[i].textContent;
        pShoreStatus.owner = pShoreStatus.owner.substring(0, pShoreStatus.owner.indexOf("'"));
    }
}
console.log("Building Owner: " + pShoreStatus.owner);