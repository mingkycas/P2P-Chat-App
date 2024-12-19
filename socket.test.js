const ioClient = require('socket.io-client');
const http = require('http');
const { Server } = require('socket.io');

let server;
let ioServer;
let clientSocket1;
let clientSocket2;

beforeAll((done) => {
  const httpServer = http.createServer();
  ioServer = new Server(httpServer);

  ioServer.on('connection', (socket) => {
    console.log('A user connected.');

    // Broadcast messages to all clients
    socket.on('message', (data) => {
      ioServer.emit('message', data);
    });

    // Broadcast typing indicator
    socket.on('typing', (username) => {
      socket.broadcast.emit('typing', username);
    });

    // Broadcast stop-typing indicator
    socket.on('stop-typing', () => {
      socket.broadcast.emit('stop-typing');
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected.');
    });
  });

  httpServer.listen(() => {
    const port = httpServer.address().port;
    server = httpServer;
    done();
  });
});

beforeEach((done) => {
  const port = server.address().port;
  clientSocket1 = ioClient.connect(`http://localhost:${port}`);
  clientSocket2 = ioClient.connect(`http://localhost:${port}`);

  let connectedClients = 0;

  const checkIfConnected = () => {
    connectedClients += 1;
    if (connectedClients === 2) {
      console.log('Both clients connected.');
      done();
    }
  };

  clientSocket1.on('connect', checkIfConnected);
  clientSocket2.on('connect', checkIfConnected);
});

afterEach(() => {
  if (clientSocket1.connected) clientSocket1.close();
  if (clientSocket2.connected) clientSocket2.close();
});

afterAll(() => {
  ioServer.close();
  server.close();
});

test('Client successfully connects to the server', (done) => {
  expect(clientSocket1.connected).toBeTruthy();
  done();
});

test('Client handles disconnection gracefully', (done) => {
  clientSocket1.on('disconnect', () => {
    expect(clientSocket1.connected).toBeFalsy();
    done();
  });
  clientSocket1.close();
}, 10000);

test('Another user successfully connects to the server', (done) => {
  setTimeout(() => {
    console.log('Checking clientSocket2 connection:', clientSocket2.connected);
    expect(clientSocket2.connected).toBeTruthy();
    done();
  }, 500); 
}, 10000);

test('Another user disconnects gracefully', (done) => {
  clientSocket2.on('disconnect', () => {
    expect(clientSocket2.connected).toBeFalsy();
    done();
  });
  clientSocket2.close();
}, 10000);

test('Message is broadcasted to all clients', (done) => {
  const testMessage = { username: 'TestUser', message: 'Hello, everyone!' };

  clientSocket2.on('message', (data) => {
    expect(data).toEqual(testMessage);
    done();
  });

  clientSocket1.emit('message', testMessage);
});

test('Typing indicator is sent to peers', (done) => {
  clientSocket2.on('typing', (username) => {
    expect(username).toBe('TestUser');
    done();
  });

  clientSocket1.emit('typing', 'TestUser');
});

test('Typing indicator is stopped correctly', (done) => {
  clientSocket2.on('stop-typing', () => {
    expect(true).toBe(true);
    done();
  });

  clientSocket1.emit('stop-typing');
});
