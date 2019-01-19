import React, { Component } from 'react';
import '../css/PhotoCubeClient.css';
import LeftDock from '../PhotoCubeClient/LeftDock/LeftDock';
import ThreeBrowser from '../PhotoCubeClient/ThreeBrowser/ThreeBrowser';
import RightDock from '../PhotoCubeClient/RightDock/RightDock';

export const MyContext = React.createContext();

class MyProvider extends Component {
  state = {
    fileCount: 0,
    name: 'Wes',
    age: 100,
    cool: true
  }
  render() {
    return (
      <MyContext.Provider 
        value={{
          state: this.state,
          growAYearOlder: () => this.setState({
            age: this.state.age + 1
          }),
          updateFileCount: (count) => {
            this.setState({fileCount: count})
          }
        }}>
        {this.props.children}
      </MyContext.Provider>
    )
  }
}

class PhotoCubeClient extends Component {
  render() {
    return (
        <div className="App grid-container">
            <MyProvider>
                <LeftDock/>
                <ThreeBrowser/>
                <RightDock/>
            </MyProvider>
        </div>
    );
  }
}

export default PhotoCubeClient;