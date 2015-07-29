tabKey = {
    "ship.php": "Ship",
    "buildings.php": "Buildings",
    "tl_res.php": "Logs",
    "tl_eq.php": "Logs",
    "missions_log.php": "Logs",
    "combat_log.php": "Logs",
    "payment_log.php": "Logs",
    "career_log.php": "Logs",
    "pilot_log.php": "Logs",
    "stats.php": "Stats",
    "advanced_skills.php": "Advanced Skills",
    "jobs.php": "Jobs",
    "map.php": "Map"
};

// disable right click functionality
document.oncontextmenu = function() {return false;}
//function RightMouseDown() { return false;}


// find tabRow
var tdList = document.getElementsByTagName("td");
var firstTab;
for (i=0;i<tdList.length;i++) {
    if (tdList[i].innerHTML === "Ship") {
        firstTab = tdList[i];
    }
}
var tabRow = firstTab.parentNode; // tr that holds overview tabs
// setup new tab button
var newTab = tabRow.insertCell(-1);
newTab.innerHTML = "Turner Tab";
newTab.style.background = "url(http://static.pardus.at/img/stdhq/tab.png)";
newTab.className = "tabcontent";
newTab.onmouseover = tabMouseover;
newTab.onmouseout = tabMouseout;
newTab.onclick = tabSetup;
newTab.oncontextmenu = console.log("HI HI HI ITS BOB MASTERS");
// increases tabRowTable width to accomodate extra tab
var tabRowTable = tabRow;
for (i=0;i<2;i++) {
    tabRowTable = tabRowTable.parentNode;
    console.log(tabRowTable.clientWidth);
}
tabRowTable.style.width = "" + (tabRowTable.clientWidth + 96) + "px";

// sets up new tab when it is clicked on
function tabSetup () {
    // modifies buttons to represent new tab selected
    newTab.style.background = 'url(http://static.pardus.at/img/stdhq/tabactive.png)';
    newTab.onmouseout = null;
    var slicedTabURL = document.URL.slice(document.URL.search("overview") + 9);
    var tabs = collectionToArray(tabRow.cells).slice(0,tabRow.cells.length - 1);
    for (i=0;i<tabs.length;i++) {
        if (tabs[i].innerHTML === tabKey[slicedTabURL]) {
            tabs[i].style.background = "url(http://static.pardus.at/img/stdhq/tab.png)";
            tabs[i].onmouseover = tabMouseover;
            tabs[i].onmouseout = tabMouseout;
            tabs[i].onmousedown = function () {
                document.location.href = 'overview_' + slicedTabURL;
            }
        }
    }
    // clear contents of current tab for replacing
    var contentTable = document.getElementsByClassName("tabstyle")[0];
    for (i=0;i<3;i++) {
        contentTable = contentTable.childNodes[0];
    }
    console.log(document.URL);
    while (contentTable.firstChild) {
        contentTable.removeChild(contentTable.firstChild);
    }
    contentTable.innerHTML = ''
}
// functions to overwrite mouseover behavior
function tabMouseout() {
    this.style.background = 'url(http://static.pardus.at/img/stdhq/tab.png)';
}
function tabMouseover() {
    this.style.background = 'url(http://static.pardus.at/img/stdhq/tabactive.png)';
    this.style.cursor = 'default';
}
// function to turn HTML collections into arrays
// MOVE
function collectionToArray(collection) {
    var arrayOut = [];
    for (i=0;i<collection.length;i++) {
        arrayOut.push(collection[i]);
    }
    return arrayOut;
}