import React, { Component } from 'react';
import axios from 'axios';

export default class MyProducts extends Component {
  constructor() {
    super();
    this.state = { items: null };
  }

  componentWillMount() {
    axios.get('/api/myproducts', {
      headers: { Authorization: localStorage.getItem('token') },
    })
    .then(res => {
      this.setState({ items: res.data.items });
    })
    .catch(e => console.log(e.response.status));
  }

  render() {
    return (
      <div id="myproducts">
        {this.state.items &&
          this.state.items.map(i => {
            const item = (
            <div key={i.id} className="item">
              <div>
                <img src={i.src}/>
                <h3>{i.name}</h3>
              </div>
              <span>${i.price}</span>
            </div>
          );
            return item;
          })
        }
      </div>
    );
  }
}
