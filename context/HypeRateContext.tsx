import { ReactNode, createContext, useEffect, useState } from "react";
import { HypeRateWebsocket } from "utils/HypeRate";
import { useRef } from "react";

const apiToken = '32DM2gak0Ks8oohCbdK2783MkAVxbV6pGsanFtdwgVmQEBxIdOVjCbTUDmrdTl1Y';
export const HypeRateContext = createContext<HypeRateWebsocket | null>(null)


const socket = new HypeRateWebsocket({
	apiKey: apiToken
})
socket.startHeartbeatTimer();
socket.startJoinTimer();

export const HypeRateProvider = ({ children }: {children:Array<ReactNode>}) => {
	return (
		<HypeRateContext.Provider value={socket}>
			{children}
		</HypeRateContext.Provider>
	);
}

