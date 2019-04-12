import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from "./Home";
import Upload from "./Upload";
import './App.scss';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/upload' component={Upload}/>
        <Route path='/date/:date' component={Upload}/>
      </Switch>
    );
  }
}

export default App;
