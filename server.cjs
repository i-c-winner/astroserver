const express=require("express");
const webSocket= require("ws");
const http = require("http");


const app = express();
const server = http.createServer(app);
const wss = new webSocket.WebSocketServer({ server });
const clients= new Map()

wss.on("connection", (ws) => {
  console.log("Клиент подключен");
  const id=Math.round(Math.random()*1000);
clients.set(id,ws);
  ws.on("message", (message) => {
    const data=JSON.parse(message);
    const target=clients.get(data.id);
    if (target){
      target.send(JSON.stringify(JSON.stringify({...data, from: id})));
    }
    console.log(`Получено сообщение: ${message}`);
  });

  ws.on("close", () => {
    console.log("Клиент отключился");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
