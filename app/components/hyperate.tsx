import { HypeRateContext } from "context/HypeRateContext";
import { useContext, useEffect, useState } from "react";

export interface HypeRateProps {
    hypeRateID: string;

}

export const HypeRate = ({ hypeRateID }: HypeRateProps) => {
    const hyperateSocket = useContext(HypeRateContext);

    const [heartbeat, setHeartbeat] = useState<number>(0);

    useEffect(() => {
        if (hyperateSocket === null) {
            return;
        }

        if (hyperateSocket.hasJoinedChannel(hypeRateID)) {
            return;
        }

        hyperateSocket.joinChannel(hypeRateID);

        hyperateSocket.addChannelSpecificListener(hypeRateID, (heartbeat: number) => {
            console.log(`Received new heartbeat for channel ${hypeRateID}: ${heartbeat}`);
            setHeartbeat(heartbeat);
        });
    }, [hypeRateID])

    return (
        <div>
            <h1>Heartbeat: {heartbeat}</h1>
        </div>
    )
}
