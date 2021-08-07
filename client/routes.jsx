import React from "react";
import { BrowserRouter as Router, Switch, Route as R } from "react-router-dom";

import Main from "./components/main";
import LootFilter from "./components/loot-filter";

export default function App() {
  return (
    <Router>
      <Switch>
        <R path="/loot-filter">
          <LootFilter />
        </R>
        <R path="/">
          <Main />
        </R>
      </Switch>
    </Router>
  );
}
