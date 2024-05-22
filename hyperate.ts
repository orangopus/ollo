import { HypeRateWebsocket } from "./context/HypeRateContext";

const apiToken = '32DM2gak0Ks8oohCbdK2783MkAVxbV6pGsanFtdwgVmQEBxIdOVjCbTUDmrdTl1Y';

console.clear();
const hyperateSocket = new HypeRateWebsocket({
    apiKey: apiToken,
});
hyperateSocket.startHeartbeatTimer();
hyperateSocket.startJoinTimer();

hyperateSocket.addGeneralListener((channel: string, heartbeat: number) => {
    console.log(`Received new heartbeat for channel ${channel}: ${heartbeat}`);
});

setTimeout(() => {
	hyperateSocket.joinChannel('internal-testing');
}, 5000);

setTimeout(() => {
	hyperateSocket.leaveChannel('internal-testing');
	console.log('Left channel');
}, 10000);