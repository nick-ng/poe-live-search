import React from "react";
import { BrowserRouter as Router, Switch, Route as R } from "react-router-dom";

import Main from "./components/main";

export default function App() {
  return (
    <Router>
      <Switch>
        <R path="/">
          <Main />
        </R>
      </Switch>
    </Router>
  );
}
