const app = require("./src/app.js");
const { Server } = require("socket.io");
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Server up! Listening port ${PORT}`);
});


const wsServer = new Server(httpServer);


wsServer.on("connection", () => {
    console.log("New client connected via WebSocket");
  });

app.set("ws", wsServer);
  
