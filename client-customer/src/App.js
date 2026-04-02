import './App.css';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Main from './components/MainComponent';
import Footer from './components/Footer';

// 🔥 IMPORT THÊM
import MyProvider from './contexts/MyProvider';

class App extends Component {
  render() {
    return (
      <MyProvider>
        <BrowserRouter>
          <Main />
          <Footer />
        </BrowserRouter>
      </MyProvider>
    );
  }
}

export default App;