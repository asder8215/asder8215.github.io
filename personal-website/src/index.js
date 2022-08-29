import React from 'react';
import ReactDOM from 'react-dom';
import Content from './Content';
import './index.css';
import Navbar from './Navbar';

// class App extends React.Component {
//   render () {
//     return (
//       <div className='App'> 
//           <h1> Hello there!</h1>
//       </div>
//     )
//   }
// }
ReactDOM.render(<Navbar />, document.getElementById('root'))
ReactDOM.render(<Content />, document.getElementById('about'))
