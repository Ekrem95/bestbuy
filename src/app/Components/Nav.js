import React, { Component }from 'react';
import { Link }from 'react-router-dom';
import axios from 'axios';
import { store } from '../JS/reducer';
import { AUTH, UNAUTH } from '../JS/actions';
import { checkAuth } from '../JS/helpers';

export default class Nav extends Component {
  constructor() {
    super();
    this.state = { loggedIn: Boolean };
  }

  componentWillMount() {
    store.subscribe(() => {
      const state = store.getState().auth.auth;
      switch (state) {
        case AUTH:
          this.setState({ loggedIn: true });
        break;
        default:
          this.setState({ loggedIn: false });
      }
    });
    if (localStorage.getItem('token') === null) {
      store.dispatch({ type: UNAUTH });
    } else {
      axios.get('/api/auth', {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then(res => {
        if (res.data.access === false) {
          store.dispatch({ type: UNAUTH });
        }

        store.dispatch({ type: AUTH });
      })
      .catch(e => console.log(e));
    }
  }

  render() {
    return (
      <div id="nav">
        {this.state.loggedIn ?
          <div>
          <div className="links">
            <Link to="/">Home</Link>
            <Link to="/addproduct">Add Product</Link>
            <Link to="/myproducts">My Products</Link>
            <span
              onClick={() => {
                axios.post('/logout')
                .then(() => {
                  localStorage.removeItem('token');
                  store.dispatch({ type: UNAUTH });
                  window.location.href = '/auth';
                })
                .catch(error => console.log(error));
              }}>
              Logout
            </span>
          </div>
          </div>
          :
          <div className="links">
            <Link to="/auth">Sign In</Link>
          </div>
        }

      </div>
    );
  }
}
