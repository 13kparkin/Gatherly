import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import GroupList from "./components/Groups/GroupList";
import GroupDetail from "./components/Groups/GroupDetail";
import CreateGroup from "./components/Groups/CreateGroup"
import UpdateGroup from "./components/Groups/UpdateGroup"
import EventList from "./components/Events/EventList";
import EventDetail from "./components/Events/EventDetail";
import "./index.css";
import CreateEvent from "./components/Events/CreateEvent";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>

      <Header className="header" isLoaded={isLoaded} />
      {isLoaded && (
        <div className="body">
        <Switch>
          <Route path={"/"} exact>
            <LandingPage />
          </Route>
          <Route path={"/groups"} exact>
            <GroupList />
          </Route>
          <Route path={"/groups/new"} exact>
            <CreateGroup />
          </Route>
          <Route path={"/groups/:groupId/edit"}>
            <UpdateGroup />
          </Route>
          <Route path={"/events"} exact>
            <EventList />
          </Route>
          <Route path={"/groups/:groupId/events/new"}>
            <CreateEvent />
          </Route>
          <Route path={"/groups/:groupId"}>
            <GroupDetail />
          </Route>
          <Route path={"/events/:eventId"}>
            <EventDetail />
          </Route>
        </Switch>
        </div>
      )}

    </>
  );
}

export default App;