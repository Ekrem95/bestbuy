import React, { Component } from 'react';

const List = ({ title, src, price }) =>
  <div>
    <h4>{title}</h4>
    <img src={src} />
    <span>${price}</span>
  </div>;

export default List;
