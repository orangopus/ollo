import { ActionFunctionArgs, json } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";

interface HeartWatchAppProps {
  heartRate: number;
}

export const loader = async () => {
  // Return the heart rate data as JSON
  return json({ heartRate: 0 }); // Return default heart rate data for server-side rendering
};

const HeartWatchApp: React.FC<HeartWatchAppProps> = ({ heartRate }) => {
  const webSocketRef = useRef<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [heartedRate, setHeartRate] = useState(0);

  useEffect(() => {
    // Establish WebSocket connection in the browser environment
    if (typeof window !== 'undefined') {
      const ws = new WebSocket('ws://localhost:3000');

      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        // Update the heart rate prop when a new heart rate is received
        setHeartRate(JSON.parse(event.data).heartRate);
        setLoading(false); // Set loading to false once data is received
        ws.close(); // Close the WebSocket connection
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setLoading(false); // Set loading to false if there's an error
      };

      webSocketRef.current = ws;

      return () => {
        // Clean up WebSocket connection when component unmounts
        if (webSocketRef.current) {
          webSocketRef.current.close();
        }
      };
    }
  }, []);

  useEffect(() => {
    // Send heart rate data to the server whenever the heart rate prop changes
    if (webSocketRef.current && heartRate > 0) {
      const message = JSON.stringify({ heartRate });
      webSocketRef.current.send(message);
      console.log('Sent message:', message);
    }
  }, [heartRate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Heart Watch App</h1>
      <p>Heart Rate: {heartedRate}</p>
    </div>
  );
};

export default HeartWatchApp;
