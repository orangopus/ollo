// websocket.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    try {
      // Parse the received message as JSON
      const data = JSON.stringify(message);
      console.log(data)

      // Check if the received message contains heart rate data
      if (data.heartRate !== undefined) {
        // Log the received heart rate data
        console.log(`Received heart rate: ${data.heartRate}`);
        
        // Acknowledge the reception by sending a response back to the WearOS app
        ws.send(JSON.stringify({ status: 'success', message: 'Received heart rate data' }));
      } else {
        console.log('Received data does not contain heart rate information');
        ws.send(JSON.stringify({ status: 'error', message: 'No heart rate data found' }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({ status: 'error', message: 'Invalid JSON' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server running`);
