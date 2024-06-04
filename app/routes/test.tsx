import { NavLink } from "@remix-run/react";
import { User, StreamVideoClient, StreamVideo, StreamCall, useCall, useCallStateHooks, ParticipantView } from "@stream-io/video-react-sdk";

const apiKey = "mmhfdzb5evj2";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiS2ktQWRpLU11bmRpIiwiaXNzIjoiaHR0cHM6Ly9wcm9udG8uZ2V0c3RyZWFtLmlvIiwic3ViIjoidXNlci9LaS1BZGktTXVuZGkiLCJpYXQiOjE3MTc1Mjk1MTMsImV4cCI6MTcxODEzNDMxOH0._i_5A33o3TrVeyY-u9nyX0y42ccO_x97NTtZfhXg4lI";
const userId = "Ki-Adi-Mundi";
const callId = "xITHKIbCxRKe";

const user: User = {
    id: userId,
    name: 'User 1',
    image: 'https://getstream.io/random_svg/?name=User+1',
}

const client = new StreamVideoClient({apiKey, user, token})
const call = client.call("livestream", callId)
call.join({ create: true})
function App() { 
    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <MyLivestrewamUI/>
            </StreamCall>
        </StreamVideo>
    );
}

export const MyLivestrewamUI = () => {
    const call = useCall();
    const { useIsCallLive, useLocalParticipant, useParticipantCount } = useCallStateHooks();
    const totalParticipants = useParticipantCount();
    const localParticipant = useLocalParticipant();
    const isCallLive = useIsCallLive();
    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px"}}>
            <div style={{ alignSelf: "flex-start", color: "white", backgroundColor: "blue", borderRadius: "20px", padding: "4px 6px"}}>
                Live: {totalParticipants}
            </div>
            <div style={{flex: "1"}}>
            {localParticipant && (
            <ParticipantView participant={localParticipant} ParticipantViewUI={null}/>
            )}
            </div>
            <div>
                {isCallLive ? (
                    <button className="button" onClick={() => call?.stopLive()}>Stop Livestream</button>
                ) : (
                    <button className="button" onClick={() => call?.goLive()}>Start Livestream</button>
                )}
            </div>
            </div>
        </div>
    );
}

export default App;