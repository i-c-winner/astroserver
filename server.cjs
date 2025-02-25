const express= require("express");
const webs= require("ws")
const http = require("http");


const app = express();
const server = http.createServer(app);
const wss = new webs.WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Клиент подключен");

  ws.on("message", (message) => {
    console.log(`Получено сообщение: ${message}`);
    ws.send(`Эхо: ${message}`);
  });

  ws.on("close", () => {
    console.log("Клиент отключился");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
