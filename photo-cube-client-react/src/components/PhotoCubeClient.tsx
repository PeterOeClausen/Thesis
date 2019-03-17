import React, { Component } from 'react';
import '../css/PhotoCubeClient.css';
import LeftDock from './LeftDock/LeftDock';
import ThreeBrowser from './Middle/ThreeBrowser/ThreeBrowser';
import GridBrowser from './Middle/GridBrowser/GridBrowser';
import CardBrowser from './Middle/CardBrowser/CardBrowser';
import RightDock from './RightDock/RightDock';
import { BrowsingModes } from './RightDock/BrowsingModeChanger';
import { BrowsingState } from './Middle/ThreeBrowser/BrowsingState';
import PickedDimension from './RightDock/PickedDimension';
import CubeObject from './Middle/ThreeBrowser/CubeObject';

/**
 * Root component of the PhotoCubeClient application, containing LeftDock, Middle and RightDock.
 */
export default class PhotoCubeClient extends React.Component {
  //Component instance refferences to allow direct child method call:
  threeBrowser = React.createRef<ThreeBrowser>();
  rightDock = React.createRef<RightDock>();
  
  //State of PhotoCubeClient used to render different browsing modes.
  state = {
    BrowsingMode: BrowsingModes.Cube, //Check selected value in BrowsingModeChanger, or pass down prop.
  }

  threeBrowserBrowsingState : BrowsingState|null = null;
  cubeObjects : CubeObject[] = [];

  render() {
    //Conditional rendering:
    let currentBrowser = null;
    if(this.state.BrowsingMode == BrowsingModes.Cube){
      currentBrowser = <ThreeBrowser ref={this.threeBrowser} 
        onFileCountChanged={this.onFileCountChanged} 
        previousBrowsingState={this.threeBrowserBrowsingState}
        onOpenCubeInCardMode={this.onOpenCubeInCardMode}
        onOpenCubeInGridMode={this.onOpenCubeInGridMode}/>
    }else if(this.state.BrowsingMode == BrowsingModes.Grid){
      currentBrowser = <GridBrowser cubeObjects={this.cubeObjects} onBrowsingModeChanged={this.onBrowsingModeChanged}/>
    }else if(this.state.BrowsingMode == BrowsingModes.Card){
      currentBrowser = <CardBrowser cubeObjects={this.cubeObjects} onBrowsingModeChanged={this.onBrowsingModeChanged}/>
    }

    //Page returned:
    return (
        <div className="App grid-container">
          <LeftDock hideControls={this.state.BrowsingMode != BrowsingModes.Cube}/>
          {currentBrowser}
          <RightDock hideControls={this.state.BrowsingMode != BrowsingModes.Cube} 
            ref={this.rightDock}
            onDimensionChanged={this.onDimensionChanged} 
            onBrowsingModeChanged={this.onBrowsingModeChanged}
            onClearAxis={this.onClearAxis}/>
        </div>
    );
  }

  /**
   * Can be called from sub-components props to update the fileCount:
   */
  onFileCountChanged = (fileCount: number) => {
    if(this.rightDock.current) this.rightDock.current.UpdateFileCount(fileCount);
  }

  /**
   * Can be called from sub-components props to update a dimension.
   */
  onDimensionChanged = (dimName: string, dimension:PickedDimension) => {
    console.log("Dimension " + dimName + ", changed to: ");
    console.log(dimension);
    if(this.state.BrowsingMode == BrowsingModes.Cube){
      this.threeBrowser.current!.UpdateAxis(dimName, dimension);
    }
  }

  /**
   * Can be called from sub-components to clear an axis in the ThreeBrowser.
   */
  onClearAxis = (axisName: string) => {
    console.log("Clear axis: " + axisName);
    switch(axisName){
      case "X": if(this.threeBrowser.current) this.threeBrowser.current.ClearXAxis(); break;
      case "Y": if(this.threeBrowser.current) this.threeBrowser.current.ClearYAxis(); break;
      case "Z": if(this.threeBrowser.current) this.threeBrowser.current.ClearZAxis(); break;
    }
  }

  /**
   * Can be called from sub-components to change the current browsing mode (the middle of the interface),
   * see BrowsingModes.tsx for details.
   */
  onBrowsingModeChanged = (browsingMode: BrowsingModes) =>{
    this.rightDock.current!.ChangeBrowsingMode(browsingMode);
    if(this.state.BrowsingMode == BrowsingModes.Cube){ //Going from cube to other:
      //Saving current browsingstate:
      this.threeBrowserBrowsingState = this.threeBrowser.current!.GetCurrentBrowsingState();
      this.cubeObjects = this.threeBrowser.current!.GetUniqueCubeObjects()
    }
    this.setState({BrowsingMode: browsingMode});
  }

  /**
   * Can be called from sub-components to open CubeObject array in CardMode.
   */
  onOpenCubeInCardMode = (cubeObjects: CubeObject[]) => {
    console.log("Opening cube in card mode:");
    this.threeBrowserBrowsingState = this.threeBrowser.current!.GetCurrentBrowsingState();
    this.cubeObjects = cubeObjects;
    this.setState({BrowsingMode: BrowsingModes.Card});
    this.rightDock.current!.ChangeBrowsingMode(BrowsingModes.Card);
  }

  /**
   * Can be called from sub-components to open CubeObject array in GridMode.
   */
  onOpenCubeInGridMode = (cubeObjects: CubeObject[]) => {
    console.log("Opening cube in grid mode:");
    this.threeBrowserBrowsingState = this.threeBrowser.current!.GetCurrentBrowsingState();
    this.cubeObjects = cubeObjects;
    this.setState({BrowsingMode: BrowsingModes.Grid});
    this.rightDock.current!.ChangeBrowsingMode(BrowsingModes.Grid);
  }
}