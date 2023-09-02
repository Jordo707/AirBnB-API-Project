import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotList from "./components/LandingPage/LandingPage.js";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import NewSpotForm from "./components/NewSpotForm/NewSpotForm";
import SpotDetails from "./components/SpotDetailsPage/SpotDetails";
import UserSpotList from "./components/ManageSpotsPage/ManageSpots";
import EditSpotForm from "./components/EditSpotForm/EditSpotForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <SpotList/>
          </Route>
          <Route path='/spots/new'>
            <NewSpotForm/>
          </Route>
          <Route path='/spots/current'>
            <UserSpotList/>
          </Route>
          <Route path="/spots/:spotId/edit">
            <EditSpotForm/>
          </Route>
          <Route path='/spots/:spotId'>
            <SpotDetails/>
          </Route>
        </Switch>
        )}
    </>
  );
}

export default App;
