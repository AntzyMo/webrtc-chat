import { Server } from 'socket.io'

const io = new Server({
  cors: {
    origin: [
      'http://localhost:5173',
      'http://192.168.61.103:5173',
      'https://localhost:5173',
      'https://192.168.61.103:5173'
    ]
  }
})
const rooms = []
io.on('connection', socket => {
  socket.on('joinRoom', roomParams => onJoinRoom(socket, roomParams))
  socket.on('offer', offer => onOffer(socket, offer))
  socket.on('answer', answer => onAnswer(socket, answer))
  socket.on('ice-candidate', iceCandidate => onIceCandidate(socket, iceCandidate))
})

function onJoinRoom(socket, roomParams) {
  const { name } = roomParams
  socket.join('www')
  rooms.push(name)
  socket.to('www').emit('peerConnect', name)
}

function onOffer(socket, offer) {
  socket.to('www').emit('offer', offer)
}

function onAnswer(socket, answer) {
  socket.to('www').emit('answer', answer)
}
function onIceCandidate(socket, iceCandidate) {
  socket.to('www').emit('ice-candidate', iceCandidate)
}

io.listen(3000)
