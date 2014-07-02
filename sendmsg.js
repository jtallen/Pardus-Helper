// ajax request for alliance data, comes back in str form
$.get("alliances.php", function(data){
    searchIndex = data.search(allianceName);
    rawAllianceLink = data.slice(searchIndex-25,searchIndex);
    constructLink(rawAllianceLink);
});

// find main table, add new row with two cells
var mainTable = document.getElementsByTagName("table")[2];
var newRow = mainTable.insertRow(2);
var cell1 = newRow.insertCell(0);
var cell2 = newRow.insertCell(1);

// resize portrait to accomodate new row
var portrait = document.getElementsByTagName("img")[3];
portrait.parentNode.rowSpan = 3;

// find alliance name from character portrait
var allianceName = portrait.title.slice(portrait.title.indexOf("-") + 2, portrait.title.length);
var linkedAllianceName = document.createElement('a');
linkedAllianceName.target = "_blank";
linkedAllianceName.innerHTML = allianceName;
// put alliance name in cell
cell2.appendChild(linkedAllianceName);

// construct link for alliance, gets ID from ajax request and 
var constructLink = function(rawStr) {
    var begin = rawStr.lastIndexOf("=");
    var end = rawStr.lastIndexOf("\"");
    var allianceID = rawStr.slice(begin,end);
    console.log(allianceID);
    linkedAllianceName.href = "http://artemis.pardus.at/alliance.php?id=" + allianceID;
}