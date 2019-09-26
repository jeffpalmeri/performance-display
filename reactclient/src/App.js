import React, { Component } from 'react';
import Widget from './Widget';
import './App.css';
import socket from './utilities/socketConnection';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      performanceData: {}
    } 
  }

  componentDidMount() {
    socket.on('data', (data) => {
      // console.log(this.state.performanceData, '*****************************');
      // inside this callback, we just got some new data
      // update state so we can re-render 
      const currentState = ({...this.state.performanceData});
      currentState[data.macA] = data;

      this.setState({
        performanceData: currentState
      });
      // console.log(this.state, '************************************');
    });
  }

  render() {
    let widgets = [];
    const data = this.state.performanceData;
    // get each machine, by property, from data
    Object.entries(data).forEach(([key, value]) => {
      console.log(key,value, '*****');
      widgets.push(<Widget key={key} data={value}/>);
    });

    return(
      <div className="App">
        {widgets}
      </div>
    )
  }
}
export default App;