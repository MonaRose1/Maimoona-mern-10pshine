import { useState, useEffect } from "react";
import { getSocket } from "@/utils/socket";

export function SocketTest() {
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    
    if (socket) {
      const handleConnect = () => {
        setConnectionStatus("connected");
        addMessage("Connected to server");
      };
      
      const handleDisconnect = () => {
        setConnectionStatus("disconnected");
        addMessage("Disconnected from server");
      };
      
      const handleNoteUpdate = (data) => {
        addMessage(`Note update received: ${data.type} - ${data.noteId}`);
      };
      
      const handleUserUpdate = (data) => {
        addMessage(`User update received: ${data.type} - ${data.userId}`);
      };
      
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("note_updated", handleNoteUpdate);
      socket.on("user_updated", handleUserUpdate);
      
      // Set initial status
      setConnectionStatus(socket.connected ? "connected" : "disconnected");
      
      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("note_updated", handleNoteUpdate);
        socket.off("user_updated", handleUserUpdate);
      };
    }
  }, []);

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-2">Socket.IO Test</h3>
      <div className="mb-2">
        <span className="font-medium">Status:</span>{" "}
        <span className={connectionStatus === "connected" ? "text-green-600" : "text-red-600"}>
          {connectionStatus}
        </span>
      </div>
      <div className="mb-2">
        <button 
          onClick={clearMessages}
          className="px-2 py-1 bg-gray-200 rounded text-sm"
        >
          Clear Messages
        </button>
      </div>
      <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
        {messages.map(msg => (
          <div key={msg.id} className="text-xs py-1 border-b last:border-b-0">
            <span className="text-gray-500">[{msg.timestamp}]</span> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}