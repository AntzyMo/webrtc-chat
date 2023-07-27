import { ref } from 'vue'

export default ws => {
  const localVideoRef = ref<HTMLVideoElement | null>(null)
  const remoteVideoRef = ref<HTMLVideoElement | null>(null)

  let stream: MediaStream
  let pc: RTCPeerConnection
  let pc1: RTCPeerConnection

  ws.on('offer', offer => {
    createRemotePeerConnection(offer)
  })

  // 接收 answer
  ws.on('answer', answer => {
    pc.setRemoteDescription(answer)
  })

  ws.on('ice-candidate', candidate => {
    const pcl = pc1 || pc
    pcl.addIceCandidate(candidate)
  })

  const setupUserMedia = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
    localVideoRef.value!.srcObject = mediaStream
    stream = mediaStream
    console.log(123)
  }

  function createPeerConnection(mediaStream: MediaStream) {
    // 1. 创建 RTCPeerConnection 实例
    const peer = new RTCPeerConnection()

    // 2. 将媒体流添加到 RTCPeerConnection 实例中
    mediaStream.getTracks().forEach(track => peer.addTrack(track, mediaStream))

    peer.onicecandidate = e => {
      console.log('onicecandidate', e)
      if (e.candidate)
        ws.emit('ice-candidate', e.candidate)
    }

    peer.onconnectionstatechange = e => {
      console.log('onconnectionstatechange', peer.connectionState)
    }

    peer.ontrack = event => {
      console.log('ontrack', event)
      remoteVideoRef.value!.srcObject = event.streams[0]
    }

    return peer
  }

  const createLocalPeerConnection = async () => {
    const peer = pc = createPeerConnection(stream)

    // 1. 创建 offer
    const offer = await peer.createOffer()

    // 2. 设置本地描述
    await peer.setLocalDescription(offer)

    ws.emit('offer', offer)
  }

  const createRemotePeerConnection = async offer => {
    const peer = pc1 = createPeerConnection(stream)

    peer.setRemoteDescription(offer)

    // 1. 创建 answer
    const answer = await peer.createAnswer()

    // 5. 设置本地描述
    await peer.setLocalDescription(answer)

    ws.emit('answer', answer)
  }

  return {
    remoteVideoRef,
    localVideoRef,
    createLocalPeerConnection,
    createRemotePeerConnection,
    setupUserMedia
  }
}
