/**************************************
          서버와 socket 연결
**************************************/
// dom이 다 로딩되고 난뒤 실행된다.
$( function(){

  // socket.io 서버에 접속
  var socket = io();

  // 접속 하자마자 name, userid를 서버로 전송
  socket.emit('login', { name : makeRandomName(), userid : Math.floor( Math.random() * 1000 ) });

  /******************************************
           서버에서 전송되어온 message
  ******************************************/
  socket.on('login', function( data ){
    $('#chatBox').append("<div><strong>" + data + "</strong> 이 접속했습니다.</div>");
  });

  socket.on('logout', function( data ){
    $('#chatBox').append("<div>" + data + "님이 나갔습니다.</div>");
  });

  socket.on('chat', function( data ){
    $('#chatBox').append("<div>" + data.from.name + "님 : " + data.msg + "</div>");
    $('#chatBox').scrollTop( $('#chatBox')[0].scrollHeight );
  });
  // 서버로 메세지 전송 메소드
  function sendMessage(){
    var $chatText = $('#chatText input[ type=text ]');
    socket.emit('chat', { msg : $chatText.val() });
    $chatText.val("");
  }
  // text창에서 엔터 누를 시 13은 Enter
  $('#chatText input[ type=text ]').keydown( function( key ){ if( key.keyCode == 13 ){ sendMessage(); } });
  // 전송 버튼 클릭 시
  $('#chatSend input[ type=button ]').click( function(){ sendMessage(); } );

  function makeRandomName(){
    let name = "";
    let possible = "abcdefghijklmnopqrstuvwxyz";

    for( let i = 0; i < 3; i++ ){
      name += possible.charAt( Math.floor( Math.random() * possible.length ) );
    }

    return name;
  }

});

/**************************************
              게임 canvas
***************************************/
$( function(){

      const UP = 87;
      const DOWN = 83;
      const RIGHT = 68;
      const LEFT = 65;

      var canvas = document.getElementById("myCanvas"); // 캔버스 문서객체
      var ctx = canvas.getContext("2d"); // 2d 캔버스 얻어오기

      var upPressed = false;
      var downPressed = false;
      var rightPressed = false;
      var leftPressed = false;

      var charX = 25;
      var charY = 25;

      // 키 눌렀을때
      function keyDownHandler(e)
      {
        if( document.activeElement.tagName != "INPUT" ){ // INPUT 태그가 포커스 되있으면 캐릭터가 움직이지 않게
            if( e.keyCode == UP )
                upPressed = true;
            if( e.keyCode == DOWN )
                downPressed = true;
            if( e.keyCode == RIGHT )
                rightPressed = true;
            if( e.keyCode == LEFT )
                leftPressed = true;
        }
      }
      // 키 누르고 땟을 때
      function keyUpHandler(e)
      {
        if( document.activeElement.tagName != "INPUT" ){
          if( e.keyCode == UP )
              upPressed = false;
          if( e.keyCode == DOWN )
              downPressed = false;
          if( e.keyCode == RIGHT )
              rightPressed = false;
          if( e.keyCode == LEFT )
              leftPressed = false;
        }
      }
      function mouseMoveHandler(e)
      {

      }

      /*****************************
              draw 메소드
      *****************************/
      function draw()
      {
          // 화면 클리어
          ctx.clearRect( 0,0, canvas.width, canvas.height );

          // Draw
          ctx.beginPath();
          ctx.fillStyle = "red";
          ctx.arc( charX, charY, 5, 0, Math.PI*2 );
          ctx.fill();
          ctx.closePath();

          // key값 검사
          if( upPressed )
              charY -= 5;
          if( downPressed )
              charY += 5;
          if( rightPressed )
              charX += 5;
          if( leftPressed )
              charX -= 5;


          requestAnimationFrame(draw); // draw 쟤요청


      }

      // draw 메소드 한번 동작 시키기
      draw();

      // 핸들러 등록
      document.addEventListener("keydown", keyDownHandler, false);
      document.addEventListener("keyup", keyUpHandler, false);
      document.addEventListener("mousemove", mouseMoveHandler, false);

});
