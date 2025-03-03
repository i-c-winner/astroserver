const express = require("express");
const webSocket = require("ws");
const http = require("http");


const app = express();
const server = http.createServer(app);
const wss = new webSocket.WebSocketServer({server});
const clients = new Map()
let offer = null
wss.on("connection", (ws) => {
  console.log("Клиент подключен");
  const id = Math.round(Math.random() * 1000);
  clients.set(id, ws);
  if (offer) {
    ws.send(JSON.stringify({
      type: "offer",
      payload: offer,
      isOffer: true
    }));
  }
  ws.on("message", (message) => {

    const data = JSON.parse(message);
    if (data.type === "offer") {
      offer = data.payload;
    }
    const target = clients.get(id);
    clients.forEach((ws, id) => {
      ws.send(JSON.stringify({...data, from: data.id}));
    })
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
