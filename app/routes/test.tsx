import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // Import video.js styles
import { Link } from "@remix-run/react";

export default function Test() {
  const [responsed, setResponsed] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: 'POST',
          url: 'https://api.thetavideoapi.com/stream',
          headers: {
            'x-tva-sa-id': 'srvacc_ext6g12em56va9ya1iv87sira',
            'x-tva-sa-secret': '5hfm0mkn1m01fdy7j1cjfqv1969vf5id',
            'Content-Type': 'application/json'
          },
          data: { "name": "cheese_test" }
        });
        setResponsed(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  useEffect(() => {
    if (playerRef.current) {
      const player = videojs(playerRef.current, {
        sources: [{
          src: "https://live5.thetavideoapi.com/hls/live/2015926/stream_a9bsfcyq46rzw5u9ncycxs26r/1717103471051/master.m3u8",
          type: "application/vnd.apple.mpegurl",
          label: "auto"
        }],
        theta_hlsjs: {
          streamId: "stream_a9bsfcyq46rzw5u9ncycxs26r",
          userId: "cheese_test",
          walletUrl: "wss://api-wallet-service.thetatoken.org/theta/ws",
          onWalletAccessToken: null,
          hlsOpts: null
        }
      });

      // Cleanup function to dispose of the player
      return () => {
        if (player) {
          player.isFullscreen(false);
        }
      };
    }
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div>
      <video
        id="player-container"
        className="video-js vjs-default-skin vjs livestream center"
        controls
        autoPlay={true}
        ref={playerRef}
      />
      <h1>Join our <Link to="https://go.orangop.us/discord">Discord</Link> for more updates</h1>
    </div>
  );
}
