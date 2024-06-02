import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  Constants,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import Hls from "hls.js";

function ParticipantView() {
  const playerRef = useRef(null);
  const { hlsUrls, hlsState } = useMeeting();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (hlsUrls.downstreamUrl && hlsState === "HLS_PLAYABLE") {
        if (Hls.isSupported()) {
          const hls = new Hls({
            capLevelToPlayerSize: true,
            maxLoadingDelay: 4,
            minAutoBitrate: 0,
            autoStartLoad: true,
            defaultAudioCodec: "mp4a.40.2",
          });
          const player = document.querySelector("#hlsPlayer");
          hls.loadSource(hlsUrls.downstreamUrl);
          hls.attachMedia(player);
        } else if (playerRef.current && typeof playerRef.current.play === "function") {
          playerRef.current.src = hlsUrls.downstreamUrl;
          playerRef.current.play();
        }
      }
    }
  }, [hlsUrls, hlsState]);

  return (
    <div>
      {hlsState !== "HLS_PLAYABLE" ? (
        <div>
          <p>Please Click Go Live Button to start HLS</p>
        </div>
      ) : (
        hlsState === "HLS_PLAYABLE" && (
          <div>
            <video
              ref={playerRef}
              id="hlsPlayer"
              autoPlay
              controls
              style={{ width: "50%", height: "50%" }}
              playsInline
              muted
              onError={(err) => {
                console.log(err, "hls video error");
              }}
            ></video>
          </div>
        )
      )}
    </div>
  );
}

function SpeakerView() {
  const [joined, setJoined] = useState(null);
  const { participants } = useMeeting();
  const mMeeting = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
      if (mMeetingRef.current.localParticipant.mode === "CONFERENCE") {
        mMeetingRef.current.localParticipant.pin();
      }
    },
  });
  const mMeetingRef = useRef(mMeeting);

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  const speakers = useMemo(() => {
    const speakerParticipants = [...participants.values()].filter(
      (participant) => participant.mode === Constants.modes.CONFERENCE
    );
    return speakerParticipants;
  }, [participants]);

  return (
    <div className="container">
      {joined === "JOINED" ? (
        <div>
          {speakers.map((participant) => (
            <ParticipantView
              participantId={participant.id}
              key={participant.id}
            />
          ))}
          <Controls />
        </div>
      ) : (
        <p>Joining the meeting...</p>
      )}
    </div>
  );
}

function Controls() {
  const { hlsState, startHls, stopHls } = useMeeting();
  const handleHLS = () => {
    console.log("hlsState", hlsState);
    if (!hlsState || hlsState === "HLS_STOPPED") {
      startHls({
        layout: {
          type: "SPOTLIGHT",
          priority: "PIN",
          gridSize: 4,
        },
        theme: "DARK",
        orientation: "landscape",
        quality: "high",
        mode: "video-and-audio",
      });
    } else if (hlsState === "HLS_STARTED" || hlsState === "HLS_PLAYABLE") {
      stopHls();
    }
  };

  return (
    <>
      {["HLS_STARTED", "HLS_STOPPING", "HLS_STARTING", "HLS_PLAYABLE"].includes(hlsState) ? (
        <button
          onClick={handleHLS}
          className="button"
          style={{ backgroundColor: "#FF5D5D" }}
        >
          {hlsState === "HLS_STARTED"
            ? "Live Starting"
            : hlsState === "HLS_STOPPING"
            ? "Live Stopping"
            : hlsState === "HLS_PLAYABLE"
            ? "Stop Live"
            : "Loading..."}
        </button>
      ) : (
        <button
          className="button"
          onClick={handleHLS}
          style={{ backgroundColor: "#FF5D5D" }}
        >
          Go Live
        </button>
      )}
    </>
  );
}

const App = () => {
  const [mode, setMode] = useState(null);

  return mode ? (
    <MeetingProvider
      config={{
        meetingId: "gi2w-h72i-9awa",
        micEnabled: true,
        webcamEnabled: true,
        name: "Cheese",
        debugMode: true,
        mode,
      }}
      joinWithoutUserInteraction
      token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5NTUxOTliYi1iYTk3LTRhMzgtOTJiMC1kOTcyNDI3ODEwNDQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcxNzM2Nzk2MywiZXhwIjoxNzE3NDU0MzYzfQ.rHpI_jTYDEvTU3I49I_0QoCbFFo4IX28fgrjR-P6A5M"
    >
      {mode === Constants.modes.CONFERENCE ? <SpeakerView /> : <ParticipantView />}
    </MeetingProvider>
  ) : (
    <div>
      <button
        className="button"
        onClick={() => setMode(Constants.modes.CONFERENCE)}
      >
        Join as Speaker
      </button>
      <button
        style={{ marginLeft: 12 }}
        className="button"
        onClick={() => setMode(Constants.modes.VIEWER)}
      >
        Join as Viewer
      </button>
    </div>
  );
};

export default App;
