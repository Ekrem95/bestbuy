import React, { Component } from 'react';
import axios from 'axios';
import { checkAuth } from '../JS/helpers';

export default class Dashboard extends Component {
  componentWillMount() {
    checkAuth(this);
  }

  render() {
    return (
      <div>
        <div>Dashboard</div>
      </div>
    );
  }
}
