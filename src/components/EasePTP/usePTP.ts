import { ref } from 'vue'

export default () => {
  const localVideoRef = ref<HTMLVideoElement | null>(null)
  const remoteVideoRef = ref<HTMLVideoElement | null>(null)

  const createLocalPeerConnection = async () => {
    const peer = new RTCPeerConnection()
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
  }

  return {
    localVideoRef,
    remoteVideoRef
  }
}
