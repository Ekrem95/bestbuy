import React, { Component } from 'react';

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <div>Dashboard</div>
        <div
          onClick={() => {
            this.props.history.push('/auth');
          }}
          >Auth</div>
      </div>
    );
  }
}
