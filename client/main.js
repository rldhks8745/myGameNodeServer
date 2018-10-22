const UP = 87;
const DOWN = 83;
const RIGHT = 68;
const LEFT = 65;

const STAND = 0;
const WALK = 1;

// 캐릭터 클래스
function Char( name ){
    this.name = name;
    this.id = undefined;
    this.x = 0;
    this.y = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.act = undefined;
    this.dir = DOWN;
};

var char;  // local 유저

var users = []; // remote 유저들

window.onload = function(){
    let canvasFrame = document.getElementById('chatFrame');
    let canvasW = canvasFrame.offsetWidth;
    let canvasH = canvasW * 0.75;
    let canvas = document.getElementById("myCanvas"); // 캔버스 문서객체
    canvas.width = canvasW;
    canvas.height = canvasH;
    $('#myCanvas').css({
        width : '' + canvasW,
        height : '' + canvasH
    });

    var $loginText = $('#loginBox input[ type=text ]');
    var $loginButton = $('#loginBox input[ type=button ]');

    $loginText.keydown( function( key ){
        if( key.keyCode == 13 ){
            login( $loginText.val() );
        }
    } );
    $loginButton.click( function(){
        login( $loginText.val() );
    } );

    /*
        login 후 게임, 채팅 진행
    */
    function login( name ){
        if( name != "" ){
            $("#myid").text(name);
            connectToServer( name );
            gameInit();
            $('#loginBox').remove();
        }
        else {
            alert("이름을 입력 해주세요.");
        }
    }

}

/**************************************
          서버와 socket 연결
**************************************/
function connectToServer( name ){

    // socket.io 서버에 접속
    var socket = io();

    // 접속 하자마자 name, userid를 서버로 전송
    char = new Char( name );

    socket.emit('login', char.name );

    /******************************************
            서버에서 전송되어온 message
    ******************************************/
    socket.on('login', function( data ){
        $('#chatBox').append("<div class='loginChat'><strong> &nbsp" + data + "</strong> 님이 접속했습니다.</div>");
        $('#chatBox').scrollTop( $('#chatBox')[0].scrollHeight );
    });

    socket.on('logout', function( data ){
        $('#chatBox').append("<div class='logoutChat'><strong> &nbsp" + data + "</strong> 님이 나갔습니다.</div>");
        $('#chatBox').scrollTop( $('#chatBox')[0].scrollHeight );
    });

  // 서버로 채팅 전송 메소드
    socket.on('chat', function( data ){
        let float;
        if( char.name == data.name ){
            $('#chatBox').append("<div class='chatMyself'><strong> &nbsp" + data.name + "</strong> : " + data.msg + "</div>");
            float = 'right';
        }
        else{
            $('#chatBox').append("<div class='chat'><strong> &nbsp" + data.name + "</strong> : " + data.msg + "</div>");
            float = 'left';
        }
        /*
            사용자들 대화를 block 처리 해주는
        */
        let height = parseFloat( window.getComputedStyle( $('#chatBox div:last').get(0) ).height ) + 18;
        $('#chatBox').append("<div style='width:100%;height:"+height+"px;float:none;'></div>");

        $('#chatBox').scrollTop( $('#chatBox')[0].scrollHeight );
    });
    function sendMessage(){
        var $chatText = $('#chatText input[ type=text ]');
        socket.emit('chat', { msg : $chatText.val() });
        $chatText.val("");
    }
    // text창에서 엔터 누를 시 13은 Enter
    $('#chatText input[ type=text ]').keydown( function( key ){ if( key.keyCode == 13 ){ sendMessage(); } });
    // 전송 버튼 클릭 시
    $('#chatSend input[ type=button ]').click( function(){ sendMessage(); } );

    socket.on('update', function( data ){ // 현재 자신과 같은 맵에 있는 유저들 data
        users = data;
    });

    // 자신 정보 서버로 update 루프
    var updateId = setInterval( function(){
        socket.emit('update', char );
    }, 16);
}

/**************************************
                게임 canvas
***************************************/
function gameInit(){
    var canvas = document.getElementById("myCanvas"); // 캔버스 문서객체
    var ctx = canvas.getContext("2d"); // 2d 캔버스 얻어오기

    var upPressed = false;
    var downPressed = false;
    var rightPressed = false;
    var leftPressed = false;

    var charImg = new Image();
    charImg.src = "/images/char.png";
    charImg.onload = function(){ char.act = STAND };

    // 키 눌렀을때
    function keyDownHandler(e)
    {
        if( document.activeElement.tagName != "INPUT" ){ // INPUT 태그가 포커스 되있으면 캐릭터가 움직이지 않게
            if( e.keyCode == UP ){
                upPressed = true;
                char.dir = UP;
                char.act = WALK;
            }
            if( e.keyCode == DOWN ){
                downPressed = true;
                char.dir = DOWN;
                char.act = WALK;
            }
            if( e.keyCode == RIGHT ){
                rightPressed = true;
                char.dir = RIGHT;
                char.act = WALK;
            }
            if( e.keyCode == LEFT ){
                leftPressed = true;
                char.dir = LEFT;
                char.act = WALK;
            }
        }
  }
  // 키 누르고 땟을 때
  function keyUpHandler(e)
  {
      if( document.activeElement.tagName != "INPUT" ){
          if( e.keyCode == UP ){
              upPressed = false;
          }
          if( e.keyCode == DOWN ){
              downPressed = false;
          }
          if( e.keyCode == RIGHT ){
              rightPressed = false;
          }
          if( e.keyCode == LEFT ){
              leftPressed = false;
          }

          if( upPressed == false && downPressed == false && rightPressed == false && leftPressed == false)
            char.act = STAND;
        }
        else {
            upPressed = false;
            downPressed = false;
            rightPressed = false;
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

      if( char.act != undefined )
        ctx.drawImage( charImg, 0,0,64,128, char.x,char.y,64,128 ); // ctx.drawImage(image,sourcex,sourcey,sourcewidth,sourceheight,drawx,drawy,drawwidth,drawheight);

      for( let i=0; i<users.length; i++ )
      {
        if( users[i].name != char.name )
        {
          ctx.drawImage( charImg, 0,0,64,128, users[i].x,users[i].y,64,128 );
        }
      }

      ctx.closePath();

      // key값 검사
      if( upPressed )
          char.y -= 5;
      if( downPressed )
          char.y += 5;
      if( rightPressed )
          char.x += 5;
      if( leftPressed )
          char.x -= 5;

      requestAnimationFrame(draw); // draw 쟤요청
  }

  // draw 메소드 한번 동작 시키기
  draw();

  // 핸들러 등록
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
}

window.onresize = function()
{
    let canvasFrame = document.getElementById('chatFrame');
    let canvas = document.getElementById("myCanvas"); // 캔버스 문서객체
    let canvasW = canvasFrame.offsetWidth;
    let canvasH = canvasW * 0.75;
    canvas.width = canvasW;
    canvas.height = canvasH;
    $('#myCanvas').css({
        width : '' + canvasW,
        height : '' + canvasH
    });
}
