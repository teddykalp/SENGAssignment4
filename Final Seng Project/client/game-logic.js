var colors;

var empty = $('.cell').css("background-color");


var player1Turn = true; 
var player2Turn = false;

var light_player1color = 'rgb(255, 255, 0)'
var light_player2color = 'rgb(255, 0, 0)'
var light_board = 'rgb(0, 0, 255)'
var dark_player1color = 'rgb(148, 0, 211)'
var dark_player2color = 'rgb(173, 255, 47)'
var dark_board = 'rgb(10, 10, 10)'
var vibrant_player1color = 'rgb(217, 90, 214)'
var vibrant_player2color= 'rgb(56, 132, 211)'
var vibrant_board = 'rgb(255, 128, 0)'

var player1color;
var player2color;

var player;


var player1;
var player2;

var style = getCookie("style")
var socket = io(); 

// used to distinguish games//
var gameid;

$('#dark').click(function(){
	var oldPlayer1color = player1color;
	var oldPlayer2color = player2color;
	player1color = dark_player1color;
	player2color = dark_player2color;
	setCookie("style", "dark")
	changeColors(oldPlayer1color,oldPlayer2color);
	changeUserColors();
	$('#board').css('background-color', dark_board);
	$('.drop').css('background-color', dark_board);
	$('.drop').css('color', player2color);
	$('.heading').css('color', 'white');
});

$('#light').click(function(){
	var oldPlayer1color = player1color;
	var oldPlayer2color = player2color;
	player1color = light_player1color;
	player2color = light_player2color;
	setCookie("style", "light");
	changeColors(oldPlayer1color,oldPlayer2color);
	changeUserColors();
	$('#board').css('background-color', light_board);
	$('.drop').css('background-color', light_board);
	$('.drop').css('color', player2color);
	$('.heading').css('color', 'black');
});

$('#vibrant').click(function(){
	var oldPlayer1color = player1color;
	var oldPlayer2color = player2color;
	player1color = vibrant_player1color;
	player2color = vibrant_player2color;
	setCookie("style", "vibrant");
	changeColors(oldPlayer1color,oldPlayer2color);
	changeUserColors();
	$('#board').css('background-color', vibrant_board);
	$('.drop').css('background-color', vibrant_board);
	$('.drop').css('color', player2color);
	$('.heading').css('color', 'black');
});

socket.on("addPlayers", function(p1,p2, code){
	if (player1 === undefined){
		player1 = p1;
	}
	if (player2 === undefined){
		player2 = p2;
	}
	console.log(gameid);
	if (gameid === undefined){
		gameid = code;
		$('#current').text(player1);
		updateColors();
	}
		
});

socket.on('changeTurn', function(user, code){
	changeTurns(code);
});

socket.on("updateMove", function(cell, user, code){
	if (gameid == code){
		if ((player2 == user) && player == "player1"){
			updateCell(cell, "p2");
		}
		else if ((player1 == user) && player == "player2"){
			updateCell(cell,"p1");
		}
	}
})

socket.on('gameOver', function(player, code){
	if (gameid == code){
		if (player == player1){
			$('#win').css('color', player1color);
		}
		else if(player == player2){
			$('#win').css('color', player2color);
		}
		$('#winheader').show();
		$('#win').text(player);
		player1Turn = false;
		player2Turn = false;
	}
});

socket.on('draw', function(code){
	if (gameid == code){
		$('#win').css('color', white)
		$('#win').text('Its a DRAW!!!');
	}
})




function checkUsers(user){
	return (player1 == user || player2 == user);
}

function updateColors(){
	if (style == ""){
		style = "light";
		setCookie("style","light")
	}

	if (style == "light"){
		player1color = light_player1color;
		player2color = light_player2color
		$('#board').css('background-color', light_board);
		$('.drop').css('background-color', light_board);
		$('.drop').css('color', player2color);
		$('.heading').css('color', 'black');
	}
	else if (style == "dark"){
		player1color = dark_player1color;
		player2color = dark_player2color;
		$('#board').css('background-color', dark_board);
		$('.drop').css('background-color', dark_board);
		$('.drop').css('color', player2color);
		$('.heading').css('color', 'white');
	}
	else if (style = 'vibrant'){
		player1color = vibrant_player1color;
		player2color = vibrant_player2color;
		$('.drop').css('background-color', vibrant_board);
		$('.drop').css('color', player2color);
		$('.heading').css('color', 'black');
	}

	changeUserColors();
	
}

function updateCell(cell, type){
	if (type == "p1"){
		$(cell).css("background-color", player1color);
	}
	else if (type == "p2"){
		$(cell).css("background-color", player2color);
	}
}

function changeColors(oldP1color,oldP2color){
	for (x = 0; x < 7; x++){
		for(y = 0; y < 7; y++){
			var cell = '#' + x + y;
			var color = $(cell).css('background-color');
			if ($(cell).css('background-color') == oldP1color){
				console.log("found");
				$(cell).css('background-color', player1color);
			}
			else if ($(cell).css('background-color') == oldP2color){
				console.log("found");
				$(cell).css('background-color', player2color);
			}
		}
	}
}

function dropChip(col){
	if (((player == "player1") && player1Turn) || ((player == 'player2') && player2Turn)){
		for (y = 6; y > -1; y--) {
	 		 var cell = '#' + y + col;
	 		 var cellColor = $(cell).css("background-color");
	 		 if (cellColor === empty){
	 		 	if (player1Turn){
	 		 		$(cell).css("background-color", player1color);
	 		 		socket.emit("move", cell, player1, gameid);
	 		 		if (winCondition(player1color,player2color)){
	 		 			socket.emit("gameOver", player1, gameid);
	 		 		}
	 		 		else if (drawCondition()){
	 		 			socket.emit("draw", gameid)
	 		 		}
	 		 		else{
	 		 			socket.emit('turnOver', player2, gameid);
	 		 		}
	 		 		return;
	 		 	}
	 		 	else if (player2Turn){
	 		 		$(cell).css("background-color", player2color);
	 		 		socket.emit("move", cell,player2, gameid);
	 		 		if (winCondition(player2color,player1color)){
	 		 			socket.emit("gameOver", player2, gameid);
	 		 		}
	 		 		else if (drawCondition()){
	 		 			socket.emit("draw", gameid);
	 		 		}
	 		 		else{
	 		 		socket.emit('turnOver', player1, gameid);
	 		 		}

	 		 		return;	
	 		 	}
	 		 }
	 		 /*$(cell).css("background-color", "yellow");*/
		}
	}
}


function winCondition(color1, color2){
	for (row = 0; row <= 6; row++){
		for (col = 0; col<=6;col++){
			cell = '#' + row + col;
			if (($(cell).css("background-color") != empty) && ($(cell).css("background-color") != color2)){
				if ((checkBounds(row) && checkBounds(col))){
					if (checkHorizontal(row, col, color1) || checkVertical(row,col,color1) || checkDiagonal(row,col,color1)){
						return true;
					}

				}
			}
		}
	}

	return false;
}

function drawCondition(){
	for (row = 0; row <= 6; row++){
		for (col = 0; col<=6;col++){
			cell = '#' + row + col;
			if ($(cell).css('background-color') == empty){
				return false;
			}
		}
	}
	return true;
}


function checkBounds(val){
	if (((val + 4) > 7) && ((val - 4) > 7) && ((val - 4) < 0) && ((val + 4) < 0)){
		return false;
	}
	return true;
}



function checkVertical(row,col,color){
	for (rowAdd = 1; rowAdd < 4; rowAdd++){
		var checkRow = row + rowAdd
		var cell = '#' + checkRow + col;
		if ($(cell).css("background-color") != color){
			return false
		}
	}

	return true;
}

function checkHorizontal(row,col,color){
	/*check horizontal*/
	for (colAdd = 1; colAdd < 4; colAdd++){
		var checkCol = col + colAdd
		var cell = '#' + row + checkCol;
		if ($(cell).css("background-color") != color){
			return false
		}
	}

	return true;
}

function checkDiagonal(row, col, color){
	for (add = 1; add < 4; add++){
		var checkCol = col + add;
		var checkRow = row - add;
		var cell = '#' + checkRow + checkCol;
		if ($(cell).css("background-color") != color){
			return false
		}
	}

	return true;
}

function changeTurns(code){
	if (gameid === code){
		if (player1Turn){
			player1Turn = false;
			player2Turn = true;
		}
		else if (player2Turn){
			player1Turn = true;
			player2Turn = false;
		}

		if ($('#current').text() == player1){
			$('#current').text(player2);
			$('#current').css('color', player2color);
		}
		else if($('#current').text() == player2){
			$('#current').text(player1);
			$('#current').css('color', player1color);
		}
	}
}

function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function setCookie(cookiename, cookievalue, expirydays) {
  	var d = new Date();
  	d.setTime(d.getTime() + (expirydays * 24 * 60 * 60 * 1000));
  	var expires = "expires="+d.toUTCString();
  	document.cookie = cookiename + "=" + cookievalue + ";" + expires + ";path=/";
}

function changeUserColors(){
	if ($('#Player').text() == player1){
		player = "player1";
		$('#Player').css('color', player1color);
		$('#Opponent').css('color', player2color);
	}
	else if ($('#Player').text() == player2){
		player = "player2";
		$('#Player').css('color', player2color);
		$('#Opponent').css('color', player1color);
	}
	if ($('#current').text() == player1){
		$('#current').css('color', player1color);
	}
	else if ($('#current').text() == player2){
		$('#current').css('color', player2color);
	}
}

