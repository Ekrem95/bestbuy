import React, { Component } from 'react';
import axios from 'axios';

export default class Dashboard extends Component {
  componentWillMount() {
    if (localStorage.getItem('token') === null) {
      this.props.history.push('/auth');
    } else {
      axios.get('/api/auth', {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then(res => {
        if (res.data.access === false) {
          localStorage.removeItem('token');
          this.props.history.push('/auth');
        }
      })
      .catch(e => console.log(e));
    }
  }

  render() {
    return (
      <div>
        <div>Dashboard</div>
      </div>
    );
  }
}
