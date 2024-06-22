import { Call, NoiseCancellationSettingsModeEnum, StreamVideoClient, type StreamVideoParticipant } from '@stream-io/video-client'
import { defineStore } from 'pinia'
import { Subscription } from 'rxjs'

const useStreamStore = defineStore('stream', ()  => {
    const apiKey = import.meta.env.VITE_APP_API_KEY
    const token = import.meta.env.VITE_APP_TOKEN

    const call = ref<Call | undefined>()
    const isBackstage = ref<boolean>(false)
    const isBackstageSub = ref<Subscription | undefined>()
    const localParticipant = ref<StreamVideoParticipant | undefined>()
    const localParticipantSub = ref<Subscription | undefined>()
    const remoteParticipant = ref<StreamVideoParticipant | undefined>()
    const remoteParticipantSub = ref<Subscription | undefined>()

    const RTMP = call.value?.state.ingress?.rtmp.address

    if (!apiKey || !token) {
        throw new Error('STREAM_API_KEY and STREAM_API_TOKEN must be set')
    }

    const streamVideoClient: StreamVideoClient = new StreamVideoClient({
        apiKey,
        token,
        user: {
            id: "orangopus",
            name: "orangopus",
            image: "https://getstream.io/random_svg/?name=orangopus"
        }
    })

    async function createCall(id: string) {
        const newCall = streamVideoClient.call('livestream', id)
        await newCall.join({ create: true})
        await newCall.camera.enable()
        await newCall.microphone.enable()
        await newCall.microphone.disableNoiseCancellation()

        localParticipantSub.value = newCall.state.localParticipant$.subscribe(
            (updatedLocalParticipant) => {
                localParticipant.value = updatedLocalParticipant
            }
        )

        isBackstageSub.value = newCall.state.backstage$.subscribe(
            (backstage) => {
                isBackstage.value = backstage
            }
        )

        call.value = newCall

    }

    async function endCall() {
        await call.value?.endCall()
        localParticipantSub.value?.unsubscribe()
        isBackstageSub.value?.unsubscribe()

        call.value = undefined
    }

    async function watchStream(id: string) {
        const newCall = streamVideoClient.call('livestream', id )
        await newCall.camera.disable()
        await newCall.microphone.disable()
        await newCall.join()
        await newCall.microphone.disableNoiseCancellation()

        remoteParticipantSub.value = newCall.state.remoteParticipants$.subscribe(
            (newRemoteParticipants) => {
                if (newRemoteParticipants && newRemoteParticipants.length > 0) {
                    remoteParticipant.value = newRemoteParticipants[0]
                } else {
                    remoteParticipant.value = undefined
                }
            }
        )

        call.value = newCall
    }

    async function leaveStream() {
        await call.value?.leave()
        remoteParticipantSub.value?.unsubscribe()

        call.value = undefined
    }

    return {
        call, 
        isBackstage,
        localParticipant,
        remoteParticipant,
        streamVideoClient,
        createCall,
        endCall,
        watchStream,
        leaveStream,
    }
})

export default useStreamStore