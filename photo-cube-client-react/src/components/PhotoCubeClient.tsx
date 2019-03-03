import React, { Component } from 'react';
import '../css/PhotoCubeClient.css';
import LeftDock from './LeftDock/LeftDock';
import ThreeBrowser from './Middle/ThreeBrowser/ThreeBrowser';
import GridBrowser from './Middle/GridBrowser/GridBrowser';
import CardBrowser from './Middle/CardBrowser/CardBrowser';
import Tagset from './Middle/ThreeBrowser/Tagset';
import Hierarchy from './Middle/ThreeBrowser/Hierarchy';
import RightDock from './RightDock/RightDock';
import { BrowsingModes } from './RightDock/BrowsingModeChanger';

export default class PhotoCubeClient extends React.Component {
  threeBrowser = React.createRef<ThreeBrowser>();
  rightDock = React.createRef<RightDock>();
  
  state = {
    BrowsingMode: BrowsingModes.Cube //Check selected value in BrowsingModeChanger
  }

  render() {
    //Conditional rendering:
    let currentBrowser = null;
    if(this.state.BrowsingMode == BrowsingModes.Cube){
      currentBrowser = <ThreeBrowser ref={this.threeBrowser} onFileCountChanged={this.onFileCountChanged}/>
    }else if(this.state.BrowsingMode == BrowsingModes.Grid){
      currentBrowser = <GridBrowser/>
    }else if(this.state.BrowsingMode == BrowsingModes.Card){
      currentBrowser = <CardBrowser/>
    }

    return (
        <div className="App grid-container">
          <LeftDock/>
          {currentBrowser}
          <RightDock ref={this.rightDock} 
            onDimensionChanged={this.onDimensionChanged} 
            onBrowsingModeChanged={this.onBrowsingModeChanged}
            onClearAxis={this.onClearAxis}/>
        </div>
    );
  }

  onFileCountChanged = (fileCount: number) => {
    if(this.rightDock.current) this.rightDock.current.UpdateFileCount(fileCount);
  }

  onDimensionChanged = (dimName: string, dimension:any) => {
    console.log("Dimension " + dimName + ", changed to: ");
    console.log(dimension);
    
    this.threeBrowser.current!.updateAxis(dimName, dimension);
    //ThreeBrowserController.getInstance().sayHello();
  }

  onBrowsingModeChanged = (browsingMode: BrowsingModes) =>{
    if(this.threeBrowser.current) this.threeBrowser.current.GetCurrentBrowsingState();
    this.setState({BrowsingMode: browsingMode});
  }

  onClearAxis = (axisName: string) => {
    console.log(axisName);
    switch(axisName){
      case "X": if(this.threeBrowser.current) this.threeBrowser.current.ClearXAxis(); break;
      case "Y": if(this.threeBrowser.current) this.threeBrowser.current.ClearYAxis(); break;
      case "Z": if(this.threeBrowser.current) this.threeBrowser.current.ClearZAxis(); break;
    }
    
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