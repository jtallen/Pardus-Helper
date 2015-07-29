// resize player portrait to accomodate new row
var portrait = document.getElementsByTagName("img")[3];
portrait.parentNode.rowSpan = 3;

// find alliance name from character portrait
var allianceName = portrait.title.slice(portrait.title.indexOf("-") + 2, portrait.title.length);

// boolean - true if player is in alliance, false if not
var inAlliance = (allianceName != "No alliance participation");

// ajax request for alliance data, comes back in str form
if (inAlliance) {
    $.get("alliances.php", function(data){
        searchIndex = data.search(allianceName);
        rawAllianceLink = data.slice(searchIndex-25,searchIndex);
        constructLink(rawAllianceLink);
    });
    //console.log(allianceName);
}

// find main table, add new row with two cells
var mainTable = document.getElementsByTagName("table")[2];
var newRow = mainTable.insertRow(2);
var cell1 = newRow.insertCell(0);
var cell2 = newRow.insertCell(1);

// alliance text - linked if inAlliance, unlinked if not
if (inAlliance) {
    var linkedAllianceName = document.createElement('a');
    linkedAllianceName.target = "_blank";
} else {
    var linkedAllianceName = document.createElement('div');
}
linkedAllianceName.innerHTML = allianceName;

// put alliance name in cell
cell2.appendChild(linkedAllianceName);

// construct link for alliance, gets ID from ajax request and 
function constructLink(rawStr) {
    var begin = rawStr.lastIndexOf("=");
    var end = rawStr.lastIndexOf("\"");
    var allianceID = rawStr.slice(begin + 1,end);
    console.log(allianceID);
    linkedAllianceName.href = "/alliance.php?id=" + allianceID;
}