const { WebSocketServer } = require('ws');

function peerProxy(httpServer) {
    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            console.log(message);
        });

        ws.on('pong', () => {
            connection.alive = true;
        });
    });

    httpServer.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
  
    setInterval(() => {
      connections.forEach((c) => {
        if (!c.alive) {
          c.ws.terminate();
        } else {
          c.alive = false;
          c.ws.ping();
        }
      });
    }, 10000);
}

module.exports = peerProxy;
