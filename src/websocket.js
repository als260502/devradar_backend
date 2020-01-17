const socketio = require("socket.io");
const pasrseStringAsArray = require('./utils/parseStringAsArray')
const calsulateDistance = require('./utils/calculateDistance')

let io
const connections = []

exports.setupWebsocket = server => {
  console.log('abrindo o socket')
  io = socketio(server);
  io.on('connection', socket => {

    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordnates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: pasrseStringAsArray(techs)

    })

  });
};


exports.findConnections = (coordnates, techs) => {
  console.log('findConnection')
  return connections.filter(connection => {
    return calsulateDistance(coordnates, connection.coordnates) < 10
      && connection.techs.some(item => techs.includes(item))
  })
}

exports.sendMessage = (to, message, data) => {
  console.log('sendMEssage')
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  })
}