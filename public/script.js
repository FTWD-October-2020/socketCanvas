const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const socket = io()
let yourId = null;

let squares = []

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//Get key from key down 
window.onkeydown = (event) => {
    //Send to the server
    socket.emit('keyFromClient', { key: event.key, id: yourId })

}


socket.on('yourId', (data) => {
    document.querySelector('h2').innerHTML = `Your id is ${data.id}`
    yourId = data.id
})


socket.on('sendSquaresFromServer', (data) => {
    console.log("from server", data)

    squares = data.squares
})

function drawSquares(data) {
    for (square of squares) {
        ctx.fillStyle = square.color
        ctx.fillRect(square.x, square.y, square.w, square.h)
        ctx.fillText(square.id, square.x, square.y)
    }
}

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawSquares()
}
animate()