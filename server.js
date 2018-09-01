
// 캐릭터 클래스
function Char( name ){
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.act = undefined;
    this.dir = undefined;
};

var express = require('express') // 웹 서버 플랫폼
, http = require('http') // http 모듈
, fs = require('fs') // 파일 로드

, app = express()
, server = http.createServer( app ).listen( 80, function(){ console.log( "Server Running" ) } );

// http 서버를 socket.io 서버로 업그레이드
var io = require('socket.io')(server, { pingTimeout:1000, pingInterval:5000, upgradeTimeout:2000 });
//, redisAdapter = require('socket.io-redis');
//io.adapter( redisAdapter({ host:'localhost', port : 6379}));

// /client로 url 요청 시 '__dirname(현재위치)/client' 에서 찾는다는것임
app.use( '/client', express.static(__dirname + '/client') );
app.use( '/images', express.static(__dirname + '/images') );
app.use( '/js', express.static(__dirname + '/js') );

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

var clients = new Map();

// 클라이언트가 socket.io 서버에 접속 했을 때 connection 이벤트 발생
// connection event handler function 인자로 socket가 전달됨
// socket는 개별 클라이언트와 상호작용 객체.
// io는 전체 클라이언트와으 상호작용 객체이다.
io.on('connection', function( socket ){
	// 클라이언트 접속 메세지 날리면
	socket.on('login', function( data ){

    socket.name = data;
    socket.join('mainroom'); // 기본적을 manroom 에 참가
    clients.set( socket.id, new Char( data ) ); // 소켓id로 key값

		// 접속된 모든 클라이언트에게 메세지 전송
		io.emit('login', data);
	});

	socket.on('chat', function( data ){
		console.log("Message from %s : %s", socket.name, data.msg );

		var msg = {
			name : socket.name,
			msg : data.msg
		};

		io.emit('chat', msg);
	});

	socket.on('update', function( data ){

    if( clients.has( socket.id ) ){
        var char = new Char( data.name );
		char.prevX = clients.get( socket.id ).x;
		char.prevY = clients.get( socket.id ).y;
		char.x = data.x;
		char.y = data.y;
		char.act = data.act;
		char.dir = data.dir;

        clients.set( socket.id, char );
    }

	});

	socket.on('forceDisconnect', function(){
		socket.disconnect();
		console.log(" forceDisconnect")
	});
    socket.on('disconnect', function(){
        if( clients.has( socket.id ) ){
            socket.broadcast.emit('logout', clients.get( socket.id ).name ); // 자신을 제외하고 다른 clients에게 logout message 보내기
            console.log("user disconnected : " + clients.get( socket.id ).name ); // log

            clients.delete( socket.id ); // 서버 메모리에서 관리하는 clients 들에서 삭제
        }
    });
});



var intervalId = setInterval( function(){
    var data = [];
    for( var value of clients.values() ){
        data.push( value ); // Map 자료구조로 안보내져서 Array로 재 생성후 보내기
    }

	io.volatile.emit('update', data );
}, 8);
