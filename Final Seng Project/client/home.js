var socket = io();
/*generate random username if cookie is not found or set*/
var user =  getCookie('username');

/* variables to control game flow */

/*inital game code*/
var gamecode;
/* join code */
var joincode;

var player1Name;
var Player2Name;

/*if username is empty, generate random one"*/
if (user === ""){
	socket.emit("getRandomName")
}
else{
	$('#user').val(user);
}

/*get random user name from the server*/
socket.on("randomUser", function(name){
	user = name;
	$('#user').val(user);
	setCookie("username", name, 365);
});

/* request a random code from the server*/
socket.emit("code", user);
socket.on("code", function(code){
  gamecode = code;
	$('#user-code').text(gamecode);
});

/* if code entered is invalid, display to user */
socket.on('invalid', function(player){
  name = $('#user').val();
  if (name == player){
    $("#errorCode").text('Invalid Code');
  }
});


/* start a randomized game */
socket.on('randomGame', function(game){
    user = $('#user').val();
    $('.start').hide();
    $('.game').show();
    if (user === game.player1){
      $('#Player').text(user);
      $('#Opponent').text(game.player2);
      setCookie('username', user, 365);
    }
    else if(user === game.player2){
      $('#Player').text(user);
      $('#Opponent').text(game.player1);
      setCookie('username', user, 365);
      socket.emit('gameStarted', game.player1, game.player2, game.code, 'random');
    }
});

/* start a gamecode game */
socket.on("startGame1", function(game){
  if (game.code == gamecode){
    player1Name = $('#user').val();;
    player2Name = game.player2;
    $('.start').hide();
    $('.game').show();
    $('#Player').text(player1Name);
    $('#Opponent').text(player2Name);
    setCookie('username', player1Name, 365);
    socket.emit('player1Info', gamecode, player1Name,player2Name);
  }
})

socket.on('startGame2', function(code,player1,player2){
  if (code == joincode){
    $('.start').hide();
    $('.game').show();
    $('#Player').text(player2);
    $('#Opponent').text(player1);
    setCookie('username', player2, 365);
    socket.emit('gameStarted', player1,player2, code, 'regular');
  }
});

/* joining a code generated game which checks with the server if it exists */
$('#join').click(function(e){
	e.preventDefault();
  user = $('#user').val();
  setCookie("username", user, 365);
	var code = $('#code').val();
  joincode = code;
	socket.emit('checkForGame', code, user);
});


/* joining a randomly generated game */
$('#random').click(function(e){
  e.preventDefault();

  user = $('#user').val();
  setCookie("username", user, 365);

  $('#look').text('Looking for game...')
  socket.emit("randomGame", user);
});

/* used for getting cookies*/
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

/* used for setting cookies*/
function setCookie(cookiename, cookievalue, expirydays) {
  	var d = new Date();
  	d.setTime(d.getTime() + (expirydays * 24 * 60 * 60 * 1000));
  	var expires = "expires="+d.toUTCString();
  	document.cookie = cookiename + "=" + cookievalue + ";" + expires + ";path=/";
}


