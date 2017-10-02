import React, { Component } from 'react';
import { validateEmail } from '../JS/helpers';

export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: true,
      msg: null,
    };

    this.check = this.check.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
  }

  componentDidMount() {
    this.check();

  }

  check() {
    if (this.state.state === true) {
      document.getElementById('signup').style.display = 'none';
      document.getElementById('login').style.display = 'flex';
    } else {
      document.getElementById('signup').style.display = 'flex';
      document.getElementById('login').style.display = 'none';
    }

    this.setState({ state: !this.state.state });
  }

  login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (validateEmail(email) === false) {
      this.setState({ msg: 'Email is not valid.' });
    } else if (password.length < 6) {
      this.setState({ msg: 'Password must have at least 6 characters.' });
    } else {
      this.setState({ msg: null });
    }
  }

  signup() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('xemail').value;
    const password = document.getElementById('xpassword').value;
    const password2 = document.getElementById('xpassword2').value;

    if (name.length < 1) {
      this.setState({ msg: 'Name field is required.' });
    } else if (validateEmail(email) === false) {
      this.setState({ msg: 'Email is not valid.' });
    } else if (password.length < 6 || password2.length < 6) {
      this.setState({ msg: 'Passwords must have at least 6 characters.' });
    } else if (password !== password2) {
      this.setState({ msg: 'Passwords do not match.' });
    } else {
      this.setState({ msg: null });
    }
  }

  render() {
    return (
      <div id="auth">
        <div className="form" id="login">
          <input type="text" placeholder="Email" id="email"/>
          <input type="password" placeholder="Password" id="password"/>
          <input
            type="button"
            value="Login"
            onClick={this.login}
          />
          <p onClick={this.check}>Sign up</p>
        </div>
        <div className="form" id="signup">
          <input type="text" placeholder="Name" id="name"/>
          <input type="text" placeholder="Email" id="xemail"/>
          <input type="password" placeholder="Password" id="xpassword"/>
          <input type="password" placeholder="Confirm Password" id="xpassword2"/>
          <input
            type="button"
            value="Sign up"
            onClick={this.signup}
           />
          <p onClick={this.check}>Login</p>
        </div>
        { this.state.msg && <p>{this.state.msg}</p> }
      </div>
    );
  }
}
