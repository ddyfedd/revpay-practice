import React from "react";
import Home from "./Home";
import PaymentSandbox from "./PaymentSandbox";
import PaymentDev from "./PaymentDev";
import { Switch, Route } from "react-router-dom";

function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/cardSandbox">
        <PaymentSandbox />
      </Route>
      <Route exact path="/cardDev">
        <PaymentDev />
      </Route>
      <Route path='/*'>
          <div> Path not found</div>
      </Route>
    </Switch>
  )
}

export default Routes;