const express = require('express');
const app = express();
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const path = require('node:path');

const viewsRouter = require('./routes/views.routes');

const authSocketCallBalck = require('./app/authSocketCallBalck');
const appSocketCallBack = require('./app/appSocketCallBack');

app.use(express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

app.use(viewsRouter);

const server = createServer(app);
const io = new Server(server);

const authSocket = io.of('/auth');
const appSocket  = io.of('/app');

authSocket.on('connection', authSocketCallBalck);
appSocket.on('connection', appSocketCallBack);


const { PORT } = require('./config');
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
