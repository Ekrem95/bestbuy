import React, { Component } from 'react';
import axios from 'axios';
import { checkAuth } from '../JS/helpers';
import List from '../JS/list';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { items: null };
  }

  componentWillMount() {
    checkAuth(this).then(loggedIn => {
      if (loggedIn) {
        axios.get('/api/allproducts', {
          headers: { Authorization: localStorage.getItem('token') },
        }).then(res => {
          this.setState({ items: res.data.items });
        })
        .catch(e => console.log(e.response.status));
      }
    });
  }

  render() {
    return (
      <div>
        <div>Dashboard</div>
        <div id="lists">
          {this.state.items &&
            this.state.items.map(i =>
                <List
                  key={i.id}
                  title={i.name}
                  src={i.src}
                  price={i.price}
                />
            )
          }
        </div>
      </div>
    );
  }
}
