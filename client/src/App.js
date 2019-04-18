import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from "./Home";
import './App.scss';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/dad/:id' component={Home}/>
      </Switch>
    );
  }
}

export default App;
