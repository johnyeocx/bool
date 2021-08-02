import { useMutation, gql } from "@apollo/client";
import React, { useState } from "react";

const CREATE_EVENT = gql`
  mutation CreateEvent($input: NewEvent!) {
    createEvent(input: $input)
  }
`;

function CreateEvent() {
  const [createEvent] = useMutation(CREATE_EVENT, {
    onError(err) {
      console.log(err);
      alert(err);
    },
  });

  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    description: "",
    members: ["johnyeocx", "zachelliott", "ethanchangys"],
    display: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const input = {
      name: newEvent.name,
      description: newEvent.description,
      date: newEvent.date,
      members: newEvent.members,
      private: false,
      eventDP: newEvent.display,
    };
    console.log(input);
    createEvent({ variables: { input } });
    // console.log(data);
  };
  return (
    <div>
      <h1>Create A New Event</h1>
      <label>
        Name:
        <input
          type="text"
          placeholder="Name..."
          name="name"
          style={{ display: "block", margin: "10px 0px" }}
          onChange={(e) => {
            setNewEvent({ ...newEvent, name: e.target.value });
          }}
        />
      </label>
      <label>
        Date:
        <input
          type="date"
          placeholder="Name..."
          name="name"
          style={{ display: "block", margin: "10px 0px" }}
          onChange={(e) => {
            setNewEvent({ ...newEvent, date: e.target.value });
          }}
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          placeholder="Name..."
          name="name"
          style={{ display: "block", margin: "10px 0px" }}
          onChange={(e) => {
            setNewEvent({ ...newEvent, description: e.target.value });
          }}
        />
      </label>
      <label>
        Display:
        <input
          type="file"
          style={{ display: "block", margin: "10px 0px 50px" }}
          onChange={(e) => {
            setNewEvent({
              ...newEvent,
              display: e.target.files[0],
            });
          }}
        />
      </label>
      <input
        type="submit"
        onClick={handleSubmit}
        value="Create Event"
        style={{
          display: "block",
          margin: "10px 0px",
          fontWeight: 700,
          height: "30px",
          width: "150px",
        }}
      />
    </div>
  );
}

export default CreateEvent;
