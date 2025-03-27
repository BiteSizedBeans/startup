const { WebSocketServer } = require('ws');
const uuid = require('uuid');

const connections = [];

function peerProxy(httpServer) {
    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws) => {
        connections.push({
            ws: ws,
            alive: true,
            id: uuid.v4()
        });
        
        ws.on('message', function message(data) {
            connections.forEach((c) => {
              if (c.id !== connection.id) {
                c.ws.send(data);
              }
            });
          });

        ws.on('close', () => {
            const pos = connections.findIndex((o, i) => o.id === id);
        
            if (pos >= 0) {
                connections.splice(pos, 1);
            }
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
