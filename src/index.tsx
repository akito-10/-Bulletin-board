import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import TalkSet from "./components/TalkSet";
import TalkPosts from "./components/TalkPosts";
import TalkRoom from "./components/TalkRoom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <>
          <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/talkset" component={TalkSet} />
            <Route exact path="/talkposts" component={TalkPosts} />
            <Route exact path="/talkroom" component={TalkRoom} />
          </Switch>
        </>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
