const express = require("express");
const webSocket = require("ws");
const http = require("http");


const app = express();
const server = http.createServer(app);
const wss = new webSocket.WebSocketServer({server});
const state={
  offer: null,
  offerId: 0,
  clients: new Map(),
  clientsSize: ()=> this.clients.size,
  adminId: Math.round(Math.random() * 1000),
}
wss.on("connection", (ws) => {
  const id=Math.round(Math.random()*1000);
  if (state.clientsSize()>=3) {
    ws.send(JSON.stringify({
      type: "error",
      payload: "full participants",
      id: state.adminId
    }));
    ws.close()
    if (state.offer) {
      ws.send(JSON.stringify({
        type: "offer",
        payload: state.offer,
        isOffer: true,
        id: state.adminId
      }))
    }
  }
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "offer"&&!state.offer) {
      state.offer = data.payload;
      state.offerId = data.id;
    }
    const target = state.clients.get(id);
    state.clients.forEach((ws, id) => {
      target.send(JSON.stringify({...data, from: data.id}));
    })
    console.log(`Получено сообщение: ${message}`);
  });

  ws.on("close", () => {
    if(state.offerId===id) {
      state.offer=null
      state.offerId=0
    }

    console.log("Клиент отключился");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
