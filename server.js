var express = require('express') // 웹 서버 플랫폼
, http = require('http') // http 모듈
, fs = require('fs') // 파일 로드

, app = express()
, server = http.createServer( app ).listen( 80, function(){ console.log( "Server Running" ) } );

// http 서버를 socket.io 서버로 업그레이드
var io = require('socket.io')(server);

// /client로 url 요청 시 '__dirname(현재위치)/client' 에서 찾는다는것임
app.use( '/client', express.static(__dirname + '/client') );

var CLIENT_DIR = "./client";

// index.html 전송
app.get( "/", function( request, response ){
	fs.readFile( CLIENT_DIR + "/index.html", function( err, data ){
		if( err ){
			response.writeHead( 404 );
			response.end( JSON.stringify( err ) );
			return;
		}

		response.writeHead( 200 );
		response.end( data );
	} );
} );

// 클라이언트가 socket.io 서버에 접속 했을 때 connection 이벤트 발생
// connection event handler function 인자로 socket가 전달됨
// socket는 개별 클라이언트와 상호작용 객체.
// io는 전체 클라이언트와으 상호작용 객체이다.
io.on('connection', function( socket ){
	let clientName;
	// 클라이언트 접속 메세지 날리면
	socket.on('login', function( data ){
		console.log( "Client logged-in : " + data.name + ", userid : " + data.userid );
		clientName = data.name;

		//socket에 클라이언트 정보 저장
		socket.name = data.name;
		socket.userid = data.userid;

		// 접속된 모든 클라이언트에게 메세지 전송
		io.emit('login', data.name);
	});

	socket.on('chat', function( data ){
		console.log("Message from %s : %s", socket.name, data.msg );

		var msg = {
			from: {
				name : socket.name,
				userid : socket.userid
			},
			msg : data.msg
		};

		io.emit('chat', msg);
	});

	socket.on('forceDisconnect', function(){
		socket.disconnect();
	});

	socket.on('disconnect', function(){
		socket.broadcast.emit('logout', socket.name );
		console.log("user disconnected : " + socket.name );
	});
});
