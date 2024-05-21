import React, { useEffect, useState, useRef } from 'react';

const WEBSOCKET_URL = 'ws://192.168.0.170:3000';

const HeartWatch: React.FC = () => {
    const [heartRate, setHeartRate] = useState<number | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const isUnmounted = useRef(false);
    const reconnectAttempts = useRef(0);

    useEffect(() => {
        isUnmounted.current = false;
        connectWebSocket();

        return () => {
            isUnmounted.current = true;
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const connectWebSocket = () => {
        console.log('Attempting to connect to WebSocket server...');
        ws.current = new WebSocket(WEBSOCKET_URL);

        ws.current.onopen = () => {
            console.log('WebSocket connection opened');
            reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onclose = (event) => {
            console.log('WebSocket connection closed');
            console.log(`Close code: ${event.code}, reason: ${event.reason}`);
            if (!isUnmounted.current) {
                handleReconnection();
            }
        };

        ws.current.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            const data = JSON.parse(event.data);
                setHeartRate(data.heartRate);

        };
    };

    const handleReconnection = () => {
        if (reconnectAttempts.current < 5) {
            reconnectAttempts.current += 1;
            const timeout = Math.min(5000, reconnectAttempts.current * 1000);
            console.log(`Attempting to reconnect in ${timeout / 1000} seconds...`);
            setTimeout(connectWebSocket, timeout);
        } else {
            console.log('Max reconnection attempts reached. Giving up.');
        }
    };

    return (
        <div>
            <h1>Heart Rate Monitor</h1>
            <p>Heart Rate: {heartRate !== null ? heartRate : 'Loading...'}</p>
        </div>
    );
};

export default HeartWatch;
