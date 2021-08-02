import React from "react";

function Messages({ messages }) {
  return (
    messages &&
    messages.map((message) => (
      <p key={messages.ID}>
        <b>{message.Sender}: </b>
        {message.Body}
      </p>
    ))
  );
}

export default Messages;
