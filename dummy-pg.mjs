import net from 'net';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    // Just close the socket or ignore data, preventing connection refused
    socket.destroy();
  });
});

server.listen(5432, '127.0.0.1', () => {
  console.log('Dummy PG listening on 5432');
});
