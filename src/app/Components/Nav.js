import React, { Component }from 'react';
import { Link }from 'react-router-dom';
import axios from 'axios';

export default class Nav extends Component {
  render() {
    return (
      <div id="nav">
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/auth">Sign In</Link>
          <Link to="/addproduct">Add Product</Link>
        </div>
        <div className="links">
          <span
            onClick={() => {
              axios.post('/logout')
              .then(() => {
                localStorage.removeItem('token');
                window.location.href = '/auth';
              })
              .catch(error => console.log(error));
            }}>
            Logout
          </span>
        </div>
      </div>
    );
  }
}
