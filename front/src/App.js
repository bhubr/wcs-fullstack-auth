import React, { Component } from 'react';
import LoginForm from './LoginForm';
import PostsList from './PostsList';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token') || '';
    this.state = {
      token
    };
    this.setToken = this.setToken.bind(this);
  }

  setToken(token) {
    this.setState({ token });
  }

  render() {
    const { token } = this.state;
    return (
      <div className="App">
        {
          token
            ? <PostsList token={token} />
            : <LoginForm setToken={this.setToken} />
        }
      </div>
    );
  }
}

export default App;
