console.log("Welcome to the backend :) ")
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

//All teh players on teh board 
let squares = []

io.on('connection', function (socket) {

    console.log(`user ${socket.id} has connected`)
    socket.emit('yourId', { id: socket.id })

    let square = {
        x: Math.random() * 500,
        y: Math.random() * 500,
        w: 50,
        h: 50,
        color: "#" + ((1 << 24) * Math.random() | 0).toString(16),
        id: socket.id
    }
    squares.push(square)
    io.sockets.emit('sendSquaresFromServer', { squares })

    //socket.emit('keyFromClient', { key: event.key, id: yourId })
    socket.on('keyFromClient', function (data) {
        console.log(data)
        let square = squares.find(eachSq => {
            return eachSq.id === data.id
        })
        if (square) {
            switch (data.key) {
                case 'ArrowLeft':
                    square.x -= 10

                    break;
                case 'ArrowRight':
                    square.x += 10

                    break;
                case 'ArrowUp':
                    square.y -= 10

                    break;
                case 'ArrowDown':
                    square.y += 10

                    break;
            }
            io.sockets.emit('sendSquaresFromServer', { squares })
        }
    })


    socket.on('disconnect', function (socket) {

        console.log(`${this.id} has disconnected`)
        let id = this.id
        console.log(squares)
        squares = squares.filter(eachSq => {
            return eachSq.id !== id
        })
        io.sockets.emit('sendSquaresFromServer', { squares })
    })

})



// Routing
app.use(express.static(path.join(__dirname, 'public')));