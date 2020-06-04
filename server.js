const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;

const www = 'public'
app.use(express.static(www));
console.log(`serving ${www}`);


app.get('/admin', (req, res) => {
    res.sendFile('/index.html', { root: www });
});


app.get('/cliente', (req, res) => {
    res.sendFile('/cliente.html', { root: www });
});

const server = app.listen(port, () => console.log(`listening on http://localhost:${port}`));
const io = require('socket.io')(http);
io.listen(server);

let clientes = [];


io.on('connection', function (socket) {
    socket.on('mensaje', function (data) {
        io.emit('mensaje2', data);
    });
    socket.on('disconnect', () => {
        socket.removeAllListeners();
    });
});
io.on('connect', (socket) => {
    clientes.push(socket.client.conn.id)
    io.emit('usuarios',clientes);
    socket.on('disconnect', () => {
        const i = clientes.indexOf(socket.client.conn.id)
        clientes.splice(i, 1);
        io.emit('usuarios', clientes)
    })
});

