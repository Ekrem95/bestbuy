import React, { Component } from 'react';
import axios from 'axios';
import { checkAuth } from '../JS/helpers';
import List from '../JS/List';
import Popup from '../JS/Popup';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { items: null, selected: null };
    this.fade = this.fade.bind(this);
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

  fade() {
    const popup = document.getElementById('popup');
    popup.style.opacity = 1;
    (function move() {
        popup.style.opacity -= 0.1;
        if (popup.style.opacity < 0.1) {
          popup.style.display = 'none';
          popup.style.opacity = 1;
          return;
        }

        setTimeout(move, 50);
      })();
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

              axios.post('/buy-product', { id }, {
                headers: { Authorization: localStorage.getItem('token') },
              },
            ).then(res => {
                this.fade();
              })
              .catch(error => {
                this.setState({ msg: error.response.status });
              });
            }}

             onCancel={this.fade}

           />
        </div>
      </div>
    );
  }
}
