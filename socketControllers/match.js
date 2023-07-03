const socketHandler = async (socket) => {
  console.log(`User connected ${socket.id}`);

    socket.on('move', (data) => {
        console.log(socket.userId);
    })

}

module.exports = { socketHandler };