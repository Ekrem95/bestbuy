import React, { Component } from 'react';
import axios from 'axios';

export default class AddProduct extends Component {
  constructor() {
    super();
    this.upload = this.upload.bind(this);
    this.state = { msg: null };
  }

  upload() {
    const name = document.getElementById('name').value;
    let price = document.getElementById('price').value;
    let quantity = document.getElementById('quantity').value;
    const tags = document.getElementById('tags').value.split(',');
    const image = document.getElementById('image').value;

    if (name.length > 0 && price.length > 0 && quantity.length > 0 && image.length > 0) {
      price = parseInt(price);
      quantity = parseInt(quantity);

      if (isNaN(price) || isNaN(quantity)) {
        this.setState({ msg: 'Price and quantity must be numbers.' });
        return;
      }

      axios.post('/upload-item', {
        name, price, quantity, tags, image,
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
      this.setState({ msg: 'All fields except "tags" are required.' });
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
          <input type="text" placeholder="Price" id="price"/>
          <label htmlFor="quantity">Quantity</label>
          <input type="text" placeholder="Quantity" id="quantity"/>
          <label htmlFor="tags">Tags are separeted by comma ','</label>
          <input type="text" placeholder="Tags" id="tags"/>
          <label htmlFor="image">Image</label>
          <input type="text" placeholder="Image Source" id="image"/>
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
