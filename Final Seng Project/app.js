var express = require("express");
var app = require('express')();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var Sentencer = require("sentencer");

var port = 8080;
/*cookie variables*/
var cookie = require('cookies');
var cookieParser = require('cookie-parser');

var games = [];
var randomUsers = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/home.html');
});

http.listen(port, function(){
	console.log("Connected on port: " + port)
});

app.use(cookieParser());
app.use(express.static(__dirname + '/client'));

io.on("connection", function(socket){
	console.log("user connected");

	socket.on('code', function(){
		var randomCode = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000)
		socket.emit('code', randomCode);
	})

	socket.on("getRandomName", function(){
		var randomName = getRandomUser();
		socket.emit('randomUser', randomName);
	});

	socket.on("disconnect", function(){
		console.log("disconnected");
	})
});


function getRandomUser(){
	var ad = Sentencer.make("{{ adjective }}");
	ad = ad.charAt(0).toUpperCase() + ad.substring(1);

	var noun = Sentencer.make("{{ noun }}");
	noun = noun.charAt(0).toUpperCase() + noun.substring(1);

	return ad + " " + noun;	
}

