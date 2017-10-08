import React, { Component } from 'react';
import axios from 'axios';

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = { sold: null, bought: null };
  }

  componentWillMount() {
    axios.get('/api/transactions', {
      headers: { Authorization: localStorage.getItem('token') },
    }).then(res => {
      const { sold, bought } = res.data;
      this.setState({ sold, bought });
    }).catch(e => console.log(e.response.status));
  }

  render() {
    return (
      <div id="transactions">
        <div>
          <h2>Sold</h2>
          <table border = "1">
           {this.state.sold &&
             this.state.sold.map(p =>
               <tbody key={p.id}>
                 <tr>
                    <td>{p.name}</td>
                    <td>${p.price}</td>
                    <td>
                      {
                      p.time
                      .replace(/T/g, ' ')
                      .substring(0, p.time.length - 8)
                    }
                    </td>
                 </tr>
             </tbody>
             )
           }
        </table>
        </div>
        <div>
          <h2>Bought</h2>
          <table border = "1">
           {this.state.bought &&
             this.state.bought.map(p =>
               <tbody key={p.id}>
                 <tr>
                    <td>{p.name}</td>
                    <td>${p.price}</td>
                    <td>
                      {
                      p.time
                      .replace(/T/g, ' ')
                      .substring(0, p.time.length - 8)
                    }
                    </td>
                 </tr>
             </tbody>
             )
           }
        </table>
        </div>
      </div>
    );
  }
}
