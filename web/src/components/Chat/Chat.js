import React, { useState } from "react";
import InputText from "./InputText";
import Messages from "./Messages";

function Chat({ currentEvent, setCurrentEvent }) {
  const baseURL = "ws://localhost:8080/ws/";
  const [ws, setWs] = useState(undefined);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const enterChat = () => {
    let ws = new WebSocket(`ws://localhost:8080/ws/${room}/${username}`);
    ws.onopen = (evt) => {
      console.log("Websocked opened!", { evt });
    };

    ws.onclose = (evt) => {
      console.log("Websocked closed!", { evt });
      setWs(undefined);
    };

    ws.onmessage = (msg) => {
      // console.log("Websocket message:", { msg });
      const obj = JSON.parse(msg.data);
      setMessages((messages) => [...messages, obj]);
    };

    ws.onerror = (error) => {
      console.log("Websocket error:", { error });
    };

    setWs(ws);
    console.log(message);
  };

  const sendMessage = () => {
    console.log(messages);
    ws.send(message);
    setMessage("");
  };

  return (
    <div class="container">
      <div class="jumbotron">
        <h1>Go Chat!</h1>
      </div>
      {ws && <Messages messages={messages} />}
      <form>
        <InputText
          placeholder={ws ? "Write message" : "Username"}
          onChange={(value) => (ws ? setMessage(value) : setUsername(value))}
          defaultValue={ws ? message : username}
        />
        {ws ? null : (
          <InputText
            placeholder="Room ID"
            onChange={(value) => setRoom(value)}
            defaultValue={room}
          />
        )}
        <button
          class="btn btn-primary"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (ws) {
              sendMessage();
            } else {
              enterChat();
            }
          }}
        >
          {ws ? "Enter" : "Send"}
        </button>
      </form>
      <div id="chat-text"></div>
    </div>
  );
}

export default Chat;
