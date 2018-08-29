// 웹소켓 전역 객체 생성
var ws = new WebSocket( "ws://35.200.85.90:3000" );

// 연결이 수립되면 서버에 메시지를 전송한다.
ws.onopen = function( event )
{
  ws.send( "Client message: Hi!" );
}

// 서버로부터 메세지가 오면
ws.onmessage = function( event )
{
  console.log( "Server message: ", event.data );
}

// 웹소켓 에러 시
ws.onerror = function( event )
{
  console.log( "Server error message: ", event.data );
}
