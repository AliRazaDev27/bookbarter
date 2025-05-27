import { useEffect } from "react"

export function WebSocketHandler() {
    useEffect(() => {
        const socket = new WebSocket(import.meta.env.VITE_SOCKET_URL);
        socket.onopen = () => {
            console.log('🟢 WebSocket connected');
            socket.send('Hello from client!');
        };
        socket.onmessage = (event) => {
            console.log('📨 Message from server:', event.data);
        };

        socket.onclose = () => {
            console.log('🔴 WebSocket disconnected');
        };

        socket.onerror = (err) => {
            console.error('❌ WebSocket error:', err);
        };
        return () => {
            if(socket.readyState === WebSocket.OPEN) {
                socket.send('Client is closing the connection');
                socket.close();
            }
            console.log('wtf');
        };

    }, [])
    return null;
}