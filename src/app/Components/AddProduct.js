import React, { Component } from 'react';
import axios from 'axios';
import { checkAuth } from '../JS/helpers';

export default class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.upload = this.upload.bind(this);
    this.state = { msg: null };
  }

  componentWillMount() {
    checkAuth(this);
  }

  upload() {
    const name = document.getElementById('name').value;
    let price = document.getElementById('price').value;
    let quantity = document.getElementById('quantity').value;
    let tags = document.getElementById('tags').value.split(',');
    const src = document.getElementById('image_src').value;

    if (name.length > 0 && price.length > 0 && quantity.length > 0 && src.length > 0) {
      price = price.replace(/,/g, '');
      price = parseInt(price);
      quantity = parseInt(quantity);
      tags = tags.filter(t => t !== '');

      if (isNaN(price) || isNaN(quantity)) {
        this.setState({ msg: 'Price and quantity must be numbers.' });
        return;
      }

      axios.post('/upload-item', {
        name, price, quantity, tags, src,
      }, {
        headers: { Authorization: localStorage.getItem('token') },
      }
    )
      .then(res => {
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({ msg: error.response.data.msg });
      });
    } else {
      this.setState({
        msg: 'All fields except "tags" are required. Price and quantity must be numbers.',
      });
    }

  }

  render() {
    return (
      <div id="addproduct">
        <h1>Add Product</h1>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" placeholder="Name" id="name"/>
          <label htmlFor="price">Price</label>
          <input type="number" placeholder="Price" id="price"/>
          <label htmlFor="quantity">Quantity</label>
          <input type="number" placeholder="Quantity" id="quantity"/>
          <label htmlFor="tags">Tags are separeted by comma ','</label>
          <input type="text" placeholder="Tags" id="tags"/>
          <label htmlFor="image_src">Image</label>
          <input type="text" placeholder="Image Source" id="image_src"/>
          <input
            onClick={this.upload}
            type="button"
            value="Add"
          />
        </div>
        { this.state.msg && <p>{this.state.msg}</p> }
      </div>
    );
  }
}
