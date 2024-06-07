import { NavLink } from "@remix-run/react";
import { User, StreamVideoClient, StreamVideo, StreamCall, useCall, useCallStateHooks, ParticipantView } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export type UseClientOptions = {
    apiKey: string;
    user: User;
    tokenOrProvider: string;
};

export const useStream = ({ apiKey, user, tokenOrProvider }: 
    UseClientOptions): StreamVideoClient | undefined => {
        const [streamClient, setStreamClient] = useState<StreamVideoClient>();

        useEffect(() => {    
            const client = new StreamVideoClient(apiKey);
            let didUserConnectInterrupt = false;

            const connectionPromise = client.connectUser(user, tokenOrProvider)
                .then(() => {
                    if (didUserConnectInterrupt) return;
                    setStreamClient(client);
                });

                return () => {
                    didUserConnectInterrupt = true;
                    setStreamClient(undefined);
                    connectionPromise.then(() => client.disconnectUser())
                    .then(() => {
                        console.log("Disconnected from Stream");
                    });
                }
        }, [apiKey, user, tokenOrProvider]);

        return streamClient;
    }