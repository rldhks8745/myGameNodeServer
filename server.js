var express = require('express') // 웹 서버 플랫폼
, http = require('http') // http 모듈
, fs = require('fs') // 파일 로드 

, app = express()
, server = http.createServer( app ).listen( 80, function(){ console.log( "Server Running" ) } );

app.use( '/client', express.static(__dirname + '/client') );

var CLIENT_DIR = "./client";


app.get( "/", function( request, response )
{
	fs.readFile( CLIENT_DIR + "/index.html", function( err, data )
	{
		if( err )
		{
			response.writeHead( 404 );
			response.end( JSON.stringify( err ) );
			return;
		}
		
		response.writeHead( 200 );
		response.end( data );
	} );	
} );

