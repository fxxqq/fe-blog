import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Icon from '../assets/logo.png';
import '../styles/index.less'

export default class App extends Component {
  render () {
    return (
      <div>
        <img src={Icon} />
        <p>react demo</p>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
