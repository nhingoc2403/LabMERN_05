import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import MyProvider from "./contexts/MyProvider";
import Login from "./components/LoginComponent";
import Main from "./components/MainComponent";
import Footer from "./components/Footer";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MyProvider>
          <div className="body-admin">
            <Login />
            <Main />
            <Footer />
          </div>
        </MyProvider>
      </BrowserRouter>
    );
  }
}

export default App;