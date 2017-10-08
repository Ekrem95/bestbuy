import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from './Components/Dashboard';
import Auth from './Components/Auth';
import Nav from './Components/Nav';
import AddProduct from './Components/AddProduct';
import MyProducts from './Components/MyProducts';
import History from './Components/History';

import style from './style.scss';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Nav />
          <Switch>
            <Route exact path="/" component={Dashboard}/>
            <Route path="/auth" component={Auth}/>
            <Route path="/addproduct" component={AddProduct}/>
            <Route path="/myproducts" component={MyProducts}/>
            <Route path="/transactions" component={History}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

render(<App />, document.querySelector('#root'));
