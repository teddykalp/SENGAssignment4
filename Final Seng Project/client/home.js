var socket = io();
/*generate random username if cookie is not found or set*/
var user =  getCookie('username');
var opponent;
var gamecode;

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

socket.emit("code");
socket.on("code", function(code){
	gamecode = code;
	$('#user-code').text(gamecode);
})

$('#join').click(function(e){
	e.preventDefault();
	var code = $('#code').val();
	socket.emit('checkForGame', code);
});

socket.on("foundGame", function(opponent){

});

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