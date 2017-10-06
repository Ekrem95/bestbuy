import React, { Component } from 'react';
import axios from 'axios';
import { checkAuth } from '../JS/helpers';
import List from '../JS/List';
import Popup from '../JS/Popup';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { items: null, selected: null };
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
                  onClick={() => {
                    this.setState({
                      selected: {
                        id: i.id,
                        title: i.name,
                        src: i.src,
                        price: i.price,
                      },
                    });

                    const popup = document.getElementById('popup');
                    popup.style.display = 'flex';
                  }}

                />
            )
          }
        </div>
        <div id="popup">
          <Popup
             {...this.state.selected}

             onAccept={() => {
              const { id } = this.state.selected;

              axios.post('/buy-product', {
                headers: { Authorization: localStorage.getItem('token') },
              }, {
                id,
              })
              .then(res => {
                console.log(res);
              })
              .catch(error => {
                this.setState({ msg: error.response.status });
              });
            }}

             onCancel={() => {
              const popup = document.getElementById('popup');
              popup.style.display = 'none';
            }}

           />
        </div>
      </div>
    );
  }
}
