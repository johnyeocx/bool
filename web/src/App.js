import { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CreateUser from "./components/CreateUser";
import SearchUser from "./components/SearchUser";
import Login from "./components/Login";
import CreateEvent from "./components/CreateEvent";
import MyEvents from "./components/MyEvents";
import Event from "./components/Event";
import Friends from "./components/Friends";
import Chat from "./components/Chat/Chat";

function App() {
  const [currentEvent, setCurrentEvent] = useState();
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/newuser">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/event">Create Event</Link>
            </li>
            <li>
              <Link to="/friends">Friends</Link>
            </li>
            <li>
              <Link to="/event-chat">Chat</Link>
            </li>
          </ul>
        </nav>
        <hr />

        <Switch>
          <Route exact path="/">
            <MyEvents setCurrentEvent={setCurrentEvent} />
          </Route>
          <Route path="/search">
            <SearchUser />
          </Route>
          <Route path="/newuser">
            <CreateUser />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/event">
            <CreateEvent />
          </Route>
          <Route path="/event-view">
            <Event
              currentEvent={currentEvent}
              setCurrentEvent={setCurrentEvent}
            />
          </Route>
          <Route path="/event-chat">
            <Chat
              currentEvent={currentEvent}
              setCurrentEvent={setCurrentEvent}
            />
          </Route>
          <Route path="/friends">
            <Friends />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
