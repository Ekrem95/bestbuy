import React, { Component } from 'react';

const Popup = (props) =>
  <div>
    <h4>{props.title}</h4>
    <img src={props.src} />
    <span>${props.price}</span>
    <p>Are you sure to buy this product?</p>
    <div id="decision">
      <span onClick={props.onAccept}>Yes</span>
      <span onClick={props.onCancel}>Cancel</span>
    </div>
  </div>;

export default Popup;
