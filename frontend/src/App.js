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
import "./index.css";

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
          <Route path={"/"} exact={true}>
            <LandingPage />
          </Route>
          <Route path={"/groups"} exact={true}>
            <GroupList />
          </Route>
          <Route path={"/groups/new"} exact={true}>
            <CreateGroup />
          </Route>
          <Route path={"/groups/:groupId/edit"}>
            <UpdateGroup />
          </Route>
          <Route path={"/events"} exact={true}>
            <EventList />
          </Route>
          <Route path={"/groups/:groupId"}>
            <GroupDetail />
          </Route>
        </Switch>
        </div>
      )}

    </>
  );
}

export default App;