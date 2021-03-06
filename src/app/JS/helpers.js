import axios from 'axios';

export const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

export const checkAuth = (component) =>
  new Promise((resolve, reject) => {
    if (localStorage.getItem('token') === null) {
      component.props.history.push('/auth');
      resolve(false);
    } else {
      axios.get('/api/auth', {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then(res => {
        resolve(true);
      })
      .catch(e => {
        if (e.response.data.access === false) {
          localStorage.removeItem('token');
          component.props.history.push('/auth');
          resolve(false);
        }
      });
    }
  });
