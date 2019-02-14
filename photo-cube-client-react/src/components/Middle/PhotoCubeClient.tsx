import React, { Component } from 'react';
import '../../css/PhotoCubeClient.css';
import LeftDock from '../LeftDock/LeftDock';
import ThreeBrowser from './ThreeBrowser/ThreeBrowser';
import RightDock from '../RightDock/RightDock';

export default class PhotoCubeClient extends React.Component {
  threeBrowser = React.createRef<ThreeBrowser>();
  rightDock = React.createRef<RightDock>();

  render() {
    return (
        <div className="App grid-container">
          <LeftDock/>
          <ThreeBrowser ref={this.threeBrowser} onFileCountChanged={this.onFileCountChanged}/>
          <RightDock ref={this.rightDock} onDimensionChanged={this.onDimensionChanged}/>
        </div>
    );
  }

  onFileCountChanged = (fileCount: number) => {
    this.rightDock.current!.UpdateFileCount(fileCount);
  }

  onDimensionChanged = (dimName: string, dimension:any) => {
    console.log("Dimension " + dimName + ", changed to: ");
    console.log(dimension);
    this.threeBrowser.current!.fetchDataAndUpdateDimensionWithTagset(dimName, dimension);
    //ThreeBrowserController.getInstance().sayHello();
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