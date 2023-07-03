const socketHandler = async (socket, io) => {
  console.log(`User connected ${socket.id}`);

    socket.on('move', (data) => {
        console.log(data);

        // validate the move
        // update the match

        io.emit(data.matchId, data.move);
    })

}

module.exports = { socketHandler };