import React, { useState, useEffect } from "react";
import { getAccessToken, accessToken } from "../AccessToken";
import { useQuery, gql } from "@apollo/client";
import { Link, Route, Switch } from "react-router-dom";
import Event from "./Event";

const MY_EVENTS = gql`
  query User($username: String!) {
    user(username: $username) {
      events
    }
  }
`;

const GET_EVENTS = gql`
  query EventsFromIds($eventIds: [String!]!) {
    eventsFromIds(eventIds: $eventIds) {
      id
      name
      date
      description
      photos
      eventDP
    }
  }
`;

function MyEvents({ setCurrentEvent }) {
  const username = localStorage.getItem("user");
  const accessToken = getAccessToken();
  const [eventIds, setEventIds] = useState([]);
  const [events, setEvents] = useState([]);
  const { loading, error, data } = useQuery(MY_EVENTS, {
    variables: { username: username },
  });

  const res = useQuery(GET_EVENTS, {
    variables: { eventIds: eventIds },
  });

  useEffect(() => {
    if (data) {
      setEventIds(data.user.events);
    }
  }, [data]);

  useEffect(() => {
    if (res.data) {
      setEvents(res.data.eventsFromIds);
    }
  }, [res]);

  if (loading) return <p>Loading...</p>;

  if (!accessToken) {
    return "Log In";
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
    console.log(eventIds);
    console.log(events);
    // setEvents(res.data.eventsFromIds);
  };

  const handleLinkButton = (event) => {
    setCurrentEvent(event);
  };

  return (
    <div>
      <h2>Welcome {username.toUpperCase()}</h2>
      <h3>Events: </h3>
      <div>
        {events
          ? events.map((event, i) => {
              return (
                <div key={event.id}>
                  <img
                    src={event.eventDP}
                    height="150px"
                    width="150px"
                    style={{
                      borderRadius: "10%",
                      objectFit: "cover",
                      margin: "0px",
                    }}
                  />
                  <Link
                    to={`/event-view`}
                    onClick={() => {
                      handleLinkButton(event);
                    }}
                  >
                    View Event
                  </Link>
                  <p key={i}>{event.name}</p>

                  <Switch>
                    <Route path="/event-view">
                      <Event />
                    </Route>
                  </Switch>
                </div>
              );
            })
          : "no events"}
      </div>
      <button onClick={handleSubmit}>Test</button>
    </div>
  );
}

export default MyEvents;
