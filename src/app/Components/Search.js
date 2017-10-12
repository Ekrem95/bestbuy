import React, { Component } from 'react';
import axios from 'axios';
import List from '../JS/List';

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = { tags: null, selected: [], items: null };
  }

  componentWillMount() {
    axios.get('/api/tags').then(res => {
      let tags = [];
      res.data.items.map(array => {
        tags = tags.concat(array.tags);
      });
      tags = tags.filter((item, pos) => tags.indexOf(item) == pos);
      tags = tags.filter(t => t !== '');

      this.setState({ tags });
    })
    .catch(e => console.log(e));
  }

  render() {
    return (
      <div id="tags">
        Search
        <div id="buttons">
        {this.state.tags &&
          this.state.tags.map(tag =>
            (
              <input
                key={tag}
                type="button"
                value={tag}
                id={tag}

                onClick={() => {
                  const button = document.getElementById(tag);
                  button.classList.toggle('selected');
                  let selected = this.state.selected;
                  if (selected.indexOf(tag) < 0) {
                    selected.push(tag);
                    this.setState({ selected });
                  } else {
                    const idx = selected.indexOf(tag);
                    selected.splice(idx, 1);
                    this.setState({ selected });
                  }

                  axios.post('/api/getbytags', {
                    selected,
                  }
                )
                  .then(res => {
                    this.setState({ items: res.data.items });
                  })
                  .catch(error => console.log(error.response));
                }}

              />
            )
          )
        }
        </div>
        <div id="lists">
          {this.state.items &&
            this.state.items.map(i =>
                <List
                  key={i.id}
                  title={i.name}
                  src={i.src}
                  price={i.price}
                />
            )
          }
        </div>
      </div>
    );
  }
}
