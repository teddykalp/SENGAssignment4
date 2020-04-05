var express = require("express");
var app = require('express')();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var Sentencer = require("sentencer");

var port = 8080;
/*cookie variables*/
var cookie = require('cookies');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.static(__dirname + '/client'));

var games = [];
var randomUsers = [];

var currentGame;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/home.html');
});

app.get('/game', function(req,res){
	 res.sendFile(__dirname + '/game.html');
})

http.listen(port, function(){
	console.log("Connected on port: " + port)
});


io.on("connection", function(socket){
	socket.on('code', function(user){
		var randomCode = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000)
		games.push({
			code: randomCode,
			player1: user,
			player2: null
		});
		socket.emit('code', randomCode);
	})

	socket.on("getRandomName", function(){
		var randomName = getRandomUser();
		socket.emit('randomUser', randomName);
	});

	socket.on("disconnect", function(){
		console.log("disconnected");
	})

	/* if a user attempts to join a game using a code */
	socket.on("checkForGame", function(code, user){
		var game = checkForGame(code);
		if (game != false){
			if (game.player1 != user){
				game.player2 = user;
				io.emit("startGame1", game);
			}
		}
		else{
			console.log('wrongcode');
			socket.emit('invalid');
		}
	});

	/* if the user wants to create a random game */
	socket.on("randomGame", function(user){
		if (!randomUsers.includes(user)){
			randomUsers.push(user);
		};

		var game = checkForRandom(user);
		if (game != false){
			console.log(game);
			io.emit("randomGame", game)
		};
	})

	socket.on("gameStarted", function(player1,player2, code){
		io.emit("addPlayers", player1,player2, code);
	});

	socket.on('player1Info', function(code,p1,p2){
		io.emit("startGame2", code, p1,p2)
	});

	socket.on('turnOver', function(player, code){
		console.log("Sending to "+player);
		console.log("With game id of " + code)
		io.emit("changeTurn", player, code);
	});

	socket.on('move', function(cell,player, code){
		io.emit("updateMove", cell, player, code);
	});

	socket.on('gameOver', function(player, code){
		io.emit('gameOver', player, code);
	});

	socket.on("draw", function(code){
		io.emit('draw', code);
	})
});

/* generates a random username */
function getRandomUser(){
	var ad = Sentencer.make("{{ adjective }}");
	ad = ad.charAt(0).toUpperCase() + ad.substring(1);

	var noun = Sentencer.make("{{ noun }}");
	noun = noun.charAt(0).toUpperCase() + noun.substring(1);

	return ad + " " + noun;	
}
/* checks for a code-generated game */
function checkForGame(gameCode){
	for (var i in games){
		if(games[i].code == gameCode){
			return games[i];
		}
	}
	return false;
}

/* checks for a random generated game*/
function checkForRandom(player1){
	console.log(randomUsers.length);
	if (randomUsers.length > 1){
		for (var i in randomUsers){
			if(randomUsers[i] != player1){
				console.log(randomUsers[i])
				game = {
					player1: player1,
					player2: randomUsers[i]
				}
				return game;
			}
		}
	}
	return false;
}

function changeName(oldname,newname){
	for (var i in games){
		if(games[i].player1 == oldname){
			games[i].player1 = newname;
			console.log(games[i]);
		}
	}
};
