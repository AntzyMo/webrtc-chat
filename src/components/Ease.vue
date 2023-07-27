
<script lang="ts" setup>
  import { ref } from 'vue'

  const localVideoRef = ref<HTMLVideoElement | null>(null)
  const remoteVideoRef = ref<HTMLVideoElement | null>(null)
  let localStream: MediaStream
  let pc1: RTCPeerConnection
  let pc2: RTCPeerConnection

  async function setupLocalMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      })
      console.log('Received local stream')
      localVideoRef.value!.srcObject = stream
      localStream = stream
    } catch (e) {
      console.log('err', e)
    }
  }

  async function call() {
    // 1. 创建 RTCPeerConnection 对象
    pc1 = new RTCPeerConnection()
    console.log('pc1', pc1)
    pc2 = new RTCPeerConnection()

    pc1.addEventListener('icecandidate', e => {
      pc2.addIceCandidate(e.candidate)
      console.log('e.candidate', e.candidate)
    })

    pc2.addEventListener('icecandidate', e => {
      console.log('e.candidate11', e.candidate)
      pc1.addIceCandidate(e.candidate)
    })

    pc2.addEventListener('track', e => {
      console.log('e123', e)
      remoteVideoRef.value!.srcObject = e.streams[0]
    })
    // 2. 获取本地流媒体并添加到 RTCPeerConnection 对象中
    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream))
    console.log('localStream.getTracks()', localStream.getTracks())
    onCreateOfferSuccess()
  }

  async function onCreateOfferSuccess() {
    const offer = await pc1.createOffer()
    console.log('offer', offer)

    await pc1.setLocalDescription(offer)
    await pc2.setRemoteDescription(offer)

    const answer = await pc2.createAnswer()
    await pc2.setLocalDescription(answer)
    await pc1.setRemoteDescription(answer)
  }

  function close() {
    pc1.close()
    pc2.close()
    pc1 = null
    pc2 = null
  }
</script>

<template>
  <button @click="setupLocalMedia">
    开始
  </button>
  <button @click="call">
    call
  </button>
  <button @click="close">
    关闭
  </button>

  <video ref="localVideoRef" autoplay controls/>
  <video ref="remoteVideoRef" autoplay controls/>
</template>
