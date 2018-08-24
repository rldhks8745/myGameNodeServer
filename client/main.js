
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
        if( e.keyCode == UP )
            upPressed = true;
        if( e.keyCode == DOWN )
            downPressed = true;
        if( e.keyCode == RIGHT )
            rightPressed = true;
        if( e.keyCode == LEFT )
            leftPressed = true;
    }
    // 키 누르고 땟을 때
    function keyUpHandler(e)
    {
        if( e.keyCode == UP )
            upPressed = false;
        if( e.keyCode == DOWN )
            downPressed = false;
        if( e.keyCode == RIGHT )
            rightPressed = false;
        if( e.keyCode == LEFT )
            leftPressed = false;
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

    