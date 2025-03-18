"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectToSSE = async () => {
      try {
        eventSource = new EventSource("/api/events");

        eventSource.onopen = () => {
          setIsConnected(true);
          console.log("SSE Connection opened");
        };

        eventSource.onmessage = (event) => {
          console.log("Received event:", event);
          setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        eventSource.onerror = (error) => {
          console.error("SSE Error:", error);
          setIsConnected(false);
          eventSource?.close();
        };
      } catch (error) {
        console.error("Error connecting to SSE:", error);
      }
    };

    connectToSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const handleReconnect = () => {
    setMessages([]);
    setIsConnected(false);

    // Force component to remount and reestablish connection
    const eventSource = new EventSource("/api/events");

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log("SSE Connection reopened");
    };

    eventSource.onmessage = (event) => {
      console.log("Received event:", event);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      setIsConnected(false);
      eventSource?.close();
    };
  };

  return (
    <div className="container my-5">
      <h1>SSE Test Page</h1>
      <div className="mt-3">
        <p>Connection status: {isConnected ? "Connected" : "Disconnected"}</p>
        <button className="btn btn-primary mb-3" onClick={handleReconnect}>
          Reconnect
        </button>
        <h3>Messages:</h3>
        <div className="border p-3 mb-3" style={{ minHeight: "200px" }}>
          {messages.length > 0 ? (
            <ul className="list-group">
              {messages.map((msg, index) => (
                <li key={index} className="list-group-item">
                  {msg}
                </li>
              ))}
            </ul>
          ) : (
            <p>No messages received yet...</p>
          )}
        </div>
      </div>
    </div>
  );
}
