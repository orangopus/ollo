import { ReactNode, createContext, useEffect, useState } from "react";
import { HypeRateWebsocket } from "utils/HypeRate";

const apiToken = '32DM2gak0Ks8oohCbdK2783MkAVxbV6pGsanFtdwgVmQEBxIdOVjCbTUDmrdTl1Y';
export const HypeRateContext = createContext<HypeRateWebsocket | null>(null);

export const HypeRateProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<HypeRateWebsocket | null>(null);

    useEffect(() => {
        const newSocket = new HypeRateWebsocket({
            apiKey: apiToken
        });
        
        newSocket.startHeartbeatTimer();
        newSocket.startJoinTimer();
        
        setSocket(newSocket);

        return () => {
            newSocket.startHeartbeatTimer();
            newSocket.startJoinTimer();
            newSocket.leaveAllChannels();
        };
    }, []);

    return (
        <HypeRateContext.Provider value={socket}>
            {children}
        </HypeRateContext.Provider>
    );
}
