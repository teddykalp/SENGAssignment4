var express = require("express");
var app = require('express')();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var Sentencer = require("sentencer");
var port = 8080;
/*cookie variables*/
var cookie = require('cookies');
var cookieParser = require('cookie-parser');


app.get('/', function(req, res){
    res.sendFile(__dirname + '/home.html');
});

http.listen(port, function(){
	console.log("Connected on port: " + port)
});


app.use(cookieParser());
app.use(express.static(__dirname + '/client'));


