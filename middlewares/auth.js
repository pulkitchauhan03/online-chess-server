const jwt = require('jsonwebtoken');

const authCheck = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        let decodedData;
        decodedData = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decodedData?.id;

        next();
    } catch (error) {
        res.status(401).json('Unauthorized')
    }
}

const authCheckSocket = async (socket, next) => {
    try {
        // FOR TESTING WITH POSTMAN ONLY
        // const token = socket.handshake.headers.token;
        const token = socket.handshake.auth.token;

        let decodedData;
        decodedData = jwt.verify(token, process.env.JWT_KEY);
        socket.userId = decodedData?.id;

        next();
    } catch (error) {
        console.log(error.message);

        // NOT TESTED

        let err  = new Error('Authentication error');
        err.data = { type : 'authentication_error' };
        next(err);
    }
}

module.exports = { authCheck, authCheckSocket }