const webSocket = require("ws")
const http = require("http");

const server = http.createServer();
const wss = new webSocket.WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Клиент подключился");

  ws.on("message", (message) => {
    console.log(`Получено сообщение: ${message}`);
    ws.send(`Эхо: ${message}`);
  });

  ws.on("close", () => {
    console.log("Клиент отключился");
  });
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`WebSocket-сервер запущен на порту ${PORT}`);
});
