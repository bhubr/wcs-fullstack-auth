import React, { Component } from 'react';

class PostsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    const { token } = this.props;
    fetch('/api/posts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(posts => this.setState({ posts }))
  }

  render() {
    const { posts } = this.state;
    return (
      <ul>
        {
          posts.map(post => (
            <li key={post.id}>
              {post.title}
            </li>
          ))
        }
      </ul>
    );
  }
}

export default PostsList;