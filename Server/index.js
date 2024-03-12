const app = require("./src/app.js");
const PORT = 8080;
const { Server } = require("socket.io");

const httpServer = app.listen(PORT, () => {
    console.log(`Server up! Listening port ${PORT}`);
});

const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
    console.log(`New client connected via WebSocket : ${socket.id}`);

    socket.on("newProduct", (product) => {
      console.log("nuevo producto")
    })
  });

app.set("ws", wsServer);
  
