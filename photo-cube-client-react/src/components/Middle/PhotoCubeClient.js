import React, { Component } from 'react';
import '../../css/PhotoCubeClient.css';
import LeftDock from '../LeftDock/LeftDock';
import ThreeBrowser from './ThreeBrowser/ThreeBrowser';
import RightDock from '../RightDock/RightDock';

export default class PhotoCubeClient extends Component {
  render() {
    return (
        <div className="App grid-container">
          <LeftDock/>
          <ThreeBrowser ref="ThreeBrowser" onFileCountChanged={this.onFileCountChanged}/>
          <RightDock onDimensionChanged={this.onDimensionChanged}/>
        </div>
    );
  }

  onDimensionChanged = (dimName, dimension) => {
    console.log("Dimension " + dimName + ", changed to: ");
    console.log(dimension);
    this.refs.ThreeBrowser.fetchDataAndUpdateDimensionWithTagset(dimName, dimension);
    //ThreeBrowserController.getInstance().sayHello();
  }

  onFileCountChanged = (fileCount) => {
    console.log("File count changed: " + fileCount);
    //TODO: Notify file count component.
  }
}

//import AppStateClass from '../ApplicationState/ApplicationState';
//export const MyContext = React.createContext();
//const AppStateInstance = new AppStateClass();

/*class MyProvider extends Component {
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
}*/