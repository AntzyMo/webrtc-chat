<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { io } from 'socket.io-client'

  import usePeer from '@/hooks/usePeer'

  const ws = io('https://192.168.61.103:3001')

  const {
    createLocalPeerConnection,
    remoteVideoRef,
    localVideoRef,
    setupUserMedia
  } = usePeer(ws)

  const showVideo = ref(false)
  const form = reactive({
    room: 'www',
    name: ''
  })

  ws.connect()

  ws.on('peerConnect', () => {
    console.log('peerConnect')
    createLocalPeerConnection()
  })

  async function joinRoom() {
    showVideo.value = true
    await setupUserMedia()
    ws.emit('joinRoom', form)
  }
</script>

<template>
  <div class="h-80vh" flex="~ 1 items-center col justify-center">
    <div v-if="!showVideo">
      <input v-model="form.room" type="text" placeholder="Room Number">
      <input v-model="form.name" type="text" placeholder="User Name">
      <button @click="joinRoom">
        join room
      </button>
    </div>
    <div v-else>
      <video ref="localVideoRef" controls autoplay/>
      <video ref="remoteVideoRef" autoplay/>
    </div>
  </div>
</template>
