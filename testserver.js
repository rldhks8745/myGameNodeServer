var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port:3000});

//연결 수립시 클라이언트에 메시지 전송하고 클라이언트로부터 메시지 수신
wss.on("connection", function(ws)
{
  ws.send("Hello! I am a server.");
  ws.on("message", function(message)
  {
    console.log("Received: " + message);
  });
});
