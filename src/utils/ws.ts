import { io } from 'socket.io-client'

const ws = io('ws://localhost:3000')

ws.on('connect', () => {
  console.log('connect')
})

export default ws

