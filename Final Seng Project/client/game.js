// Many functions taken from Mt. Ford Studios

//colors 
const COLOR_BG ='#5ADBFF';
const COLOR_FRAME = "white";

const GRID_CIRCLE = 0.7 // circle size as a fraction of cell size
const GRID_COLS = 7; // number of game columns
const GRID_ROWS = 7; // number of game rows
const MARGIN = 0.02

// set up canvas
var canv = document.createElement('canvas')
document.body.appendChild(canv);
var ctx = canv.getContext("2d");

// game variables
var grid = [];

//dimensions
var height, width, margin;
setDimensions();

//event listener
window.addEventListener('resize', setDimensions);

// game loop
var timeDelta, timeLast;

requestAnimationFrame(loop);

function loop(timeNow){
	//init timeLast
	if(!timeLast){
		timeLast = timeNow;
	}

	// calculate time difference
	timeDelta = (timeNow - timeLast) / 1000;
	timeLast = timeNow;

	//update

	//draw
	drawBackground();

	// call the next frame
	requestAnimationFrame(loop);
}

function drawBackground() {
	ctx.fillStyle = COLOR_BG;
	ctx.fillRect(0,0,width,height);
}

function createGrid() {
	grid = [];

	// set up cell size and margins
	var cell, marginX, marginY;

	// portrait
	if ((width-margin * 2) * GRID)
	// landscape
}

function newGame(){
	createGrid();
}


function setDimensions(){
	height = window.innerHeight;
	width = window.innerWidth;
	canv.height = height;
	canv.width = width;
	margin = MARGIN * Math.min(height,width);
	newGame();
};