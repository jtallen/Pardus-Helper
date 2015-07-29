/**
* @name cjPardusHelper
* @author Crashjet
*
*
*/


/**
* Code stop notes:
* @date 1/28/15
* @last problem - everytime the player moves a tile, the listener on the aCmdCollect button is removed because that panel reloads (I think)
* @immediate - figure out a way to add a new listener to aCmdCollect each time it reloads, at what point do I put this in the code?
* @upcoming - fix resource display for click events on aCmdTank, inputShipCloak, inputShipUncloak
* - fix tile info gathering for wormhole jumps (aCmdWarp)
* @planned - use timestamps to estimate new tile updates, check these dynamically upon page load
* - format this to work for tiles other than energy
* - make this entire functionality disableable
*/

var initialLoad = true;

// 
var clicked = true;

// get current coords and set them in local storage
var curCoords = document.getElementById('coords').textContent;
localStorage.setItem('shipCoords', 0);

// get tile ID initially
var shipTileID = 0;
var headInfo = document.getElementsByTagName('head')[0].textContent;
var targetTileID = headInfo.slice(headInfo.indexOf('userloc = ') + 10, headInfo.indexOf(';', headInfo.indexOf('userloc = ')));

// get number of tiles in navTable (for use later)
var tileTotal = headInfo.slice(headInfo.indexOf('fieldsTotal = ') + 14, headInfo.indexOf(';', headInfo.indexOf('fieldsTotal = ')));
var centerTileIndex = (tileTotal - 1) / 2;
var centerTileId = "tdNavField" + centerTileIndex;

// populates energy fields array from local storage
var energyFields = [];
var localEnergyString;
var localEnergyList;

if (localStorage.getItem('energyFields_crashjet') === null) {
    localStorage.setItem('energyFields_crashjet', "");
} else {
    localEnergyString = localStorage.getItem('energyFields_crashjet');
    localEnergyList = localEnergyString.split(':');
    localEnergyList.shift();
    console.log(localEnergyList);
    for (i = 0; i < localEnergyList.length; i += 3) {
        // console.log("Tile ID local:" + localEnergyList[i]);
        energyFields[localEnergyList[i]] = new EnergyField(localEnergyList[i], localEnergyList[i + 1], localEnergyList[i + 2]);
    }
}

// adds listener to div that holds nav table to check if user navigates to new tile
var navDiv = document.getElementById('nav').parentNode;
navDiv.addEventListener('click', navClick, true);

// adds listener to check for energy collect
var energyButton = document.getElementById('aCmdCollect');
energyButton.addEventListener('click', energyCollect, true);

// initial navscreen setup
navLoad();

// sets up listener to tell when to do nav load info
document.getElementById('nav').parentNode.addEventListener('load', navLoad, true);

// commandsBox = document.getElementById('commands_content');

// energyCollect click handler function
function energyCollect(event) {
    clicked = true;
    console.log("energyCollect fired"); // @debug
}

/* 
 * @desc this function is triggered when a user clicks on a tile, and then updates targetTileID to the ID of the clicked tile
 * @param object event - the click event, the .target of which will be the tile image (or text, if it has been modified by tileTracker.js)
 */
function navClick(event) {
    clicked = true;
    console.log("navClick fired"); // @debug
    var clickTarget = event.target;
    var clickTargetLink;
    // sets clickTarget to the <a> tag that encompasses clickTarget
    if (clickTarget.parentNode.nodeName === "DIV") { // checks if clicked tile has already been modified (by this script)
        clickTargetLink = clickTarget.parentNode.parentNode;
    } else if (clickTarget.parentNode.nodeName === "A") {
        clickTargetLink = clickTarget.parentNode;
    } else {
        throw "cjPardusHelper: clicked tile ID not found";
    }
    // checks if the clicked tile is moveable, sets targetTileID to the new tile's ID
    // TODO: this needs to be modified to account for if someone clicks on a tile that they can't move to (no fuel, APs, etc.)
    if (clickTargetLink.getAttribute('onclick')) { // checks if the clicked tile 
        console.log("The clickTarget is a reachable tile."); // @debug
        console.log("clicked =" + clickTargetLink.getAttribute('onclick')); // @debug
        console.log(clickTargetLink.getAttribute('onclick')); // @debug
        console.log(clickTargetLink.getAttribute('onclick').slice(clickTargetLink.getAttribute('onclick').lastIndexOf('(') + 1, clickTargetLink.getAttribute('onclick').indexOf(')')));
        targetTileID = clickTargetLink.getAttribute('onclick').slice(clickTargetLink.getAttribute('onclick').lastIndexOf('(') + 1, clickTargetLink.getAttribute('onclick').lastIndexOf(')'));
    }
    //console.log(clickTarget.innerHTML);
}

function navLoad() {
    // reset stuff
    console.log("navload fired"); //@debug
    if (clicked === true) {
        // check if moved
        if (document.getElementById('coords').textContent != localStorage.shipCoords) {
            shipTileID = targetTileID;
            shipTile();
            localStorage.setItem('shipCoords', document.getElementById('coords').textContent);
            resourceDisplay();
            clicked = false;
            initialLoad = false;
        } else {
            resourceDisplay();
            console.log("clicked is false")
            clicked = false;
            initialLoad = false;
        }
    }
}

// displays resources on the navscreen
function resourceDisplay() {
    var anchorList = document.getElementsByTagName('a');
    console.log("resourceDisplay Fired");
    // displays resource value on top of center tile (which is not always on anchor, as on initial load)
    if (initialLoad && energyFields[shipTileID]) {
        // console.log("InitialLoad resourceDisplay fired");
        var centerTile = document.getElementById(centerTileId);
        var anchorID = shipTileID;
        var divCoding = '<div style="position:relative">';
        divCoding += centerTile.innerHTML;
        divCoding += '<h2 style="color:blue; position: absolute; top: 10px; left: 16px; width: 50%; cursor: pointer">' + energyFields[anchorID].resources + '</h2>'
        divCoding += '</div>'
        centerTile.innerHTML = divCoding;
    }
    
    // goes through anchor tag imgs on the page and displays resource values on top of them
    for (i=0;i<anchorList.length;i++) {
        // gets the ID of the anchor
        if (anchorList[i].getAttribute('onclick')) {
            var anchorID = anchorList[i].getAttribute('onclick').slice(anchorList[i].getAttribute('onclick').lastIndexOf('(') + 1, anchorList[i].getAttribute('onclick').lastIndexOf(')'));
        }
        // checks if the ID is in the energyFields list and has an img, then replaces the tiles inner HTML with a div that displays the resource amounts
        if (energyFields[anchorID] && anchorList[i].getElementsByTagName('IMG')[0]) {
            // sets up the new innerHTML with updated resource text
            var divCoding = '<div style="position:relative">';
            divCoding += anchorList[i].innerHTML;
            divCoding += '<h2 style="color:red; position: absolute; top: 10px; left: 16px; width: 50%; cursor: pointer">' + energyFields[anchorID].resources + '</h2>'
            divCoding += '</div>'
            anchorList[i].innerHTML = divCoding;
        }
    }
}

// EnergyField object, stores ID and amt, and optionally, date
function EnergyField (ID, amt, date) {
    this.tileID = ID;
    this.resources = amt;
    if (typeof date === 'undefined') {
        var d = new Date();
        this.timestamp = d.getTime();
    } else {
        this.timestamp = date;
    }
    this.stringInfo = ":" + this.tileID + ":" + this.resources + ":" + this.timestamp;
}

// sets up the information for the tile that the ship recently landed upon and posts it to chat, this
function shipTile() {
    this.sector = document.getElementById("sector").textContent;
    this.coords = document.getElementById("coords").textContent;
    this.resources = document.getElementById("fieldres").textContent;
    this.typeImg = document.getElementById("tdStatusResImg").firstChild.src;
    this.type = this.typeImg.slice(this.typeImg.lastIndexOf("/") + 1, this.typeImg.lastIndexOf("."));
    this.timestamp = "";
    if (this.type === "energy") {
        energyFields[shipTileID] = new EnergyField(shipTileID, this.resources);
        console.log(energyFields[shipTileID]);
        var energyFieldString = "";
        for (x in energyFields) {
            console.log("boob");
            console.log(energyFields[x]);
            energyFieldString += energyFields[x].stringInfo;
            console.log(energyFieldString);
        }
        localStorage.setItem('energyFields_crashjet', energyFieldString);
    }
    console.log("Sector: " + this.sector);
    console.log("Coords: " + this.coords);
    console.log("Resources: " + this.resources);
    console.log("TileID: " + shipTileID);
    console.log("Type: " + this.type);
    console.log(energyFields);
}