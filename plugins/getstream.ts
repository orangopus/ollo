import { StreamVideoClient } from '@stream-io/video-client'
import { defineStore } from 'pinia'

export default defineNuxtPlugin(() => {
const useStreamStore = defineStore('stream', ()  => {
    const apiKey = process.env.STREAM_API_KEY
    const token = process.env.STREAM_API_TOKEN

    if (!apiKey || !token) {
        throw new Error('STREAM_API_KEY and STREAM_API_TOKEN must be set')
    }

    const streamVideoClient: StreamVideoClient = new StreamVideoClient({
        apiKey,
        token,
        user: {
            id: "Stefan",
            name: "Stefan",
            image: "https://getstream.io/random_svg/?name=Stefan"
        }
    })
    return {
        streamVideoClient
    }
})
})