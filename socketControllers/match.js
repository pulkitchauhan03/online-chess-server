const socketHandler = async (socket, io) => {
  console.log(`User connected ${socket.id}`);

    socket.on('move', (data) => {
        console.log(data);

        // validate the move
        // update the match
        console.log(socket.rooms);

        socket.to(data.matchId).emit("move", data.move);
    })

    socket.on("join", (matchId) => {
        console.log(`${socket.userId} User joined ${matchId}`);
        socket.join(matchId);
    })

    socket.on("disconnect", () => {
        console.log(`User disconnected ${socket.id}`);
    });

}

module.exports = { socketHandler };