import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from './Components/Dashboard';
import Auth from './Components/Auth';

import style from './style.scss';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Dashboard}/>
          <Route path="/auth" component={Auth}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

render(<App />, document.querySelector('#root'));
