const app = require('./app');
const http = require('http');

const server = http.createServer(app);
const PORT = 3030;

server.on('listening', () => {
    console.log('server listen on port : ' + PORT)
});

server.listen(PORT);