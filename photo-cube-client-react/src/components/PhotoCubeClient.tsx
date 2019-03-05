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
import { BrowsingState } from './Middle/ThreeBrowser/BrowsingState';
import PickedDimension from './RightDock/PickedDimension';
import CubeObject from './Middle/ThreeBrowser/CubeObject';

export default class PhotoCubeClient extends React.Component {
  threeBrowser = React.createRef<ThreeBrowser>();
  threeBrowserBrowsingState : BrowsingState|null = null;
  rightDock = React.createRef<RightDock>();
  
  state = {
    BrowsingMode: BrowsingModes.Cube, //Check selected value in BrowsingModeChanger, or pass down prop.
    cubeObjects: []
  }

  render() {
    //Conditional rendering:
    let currentBrowser = null;
    if(this.state.BrowsingMode == BrowsingModes.Cube){
      currentBrowser = <ThreeBrowser ref={this.threeBrowser} 
        onFileCountChanged={this.onFileCountChanged} 
        previousBrowsingState={this.threeBrowserBrowsingState}
        onOpenCubeInCardMode={this.onOpenCubeInCardMode}/>
    }else if(this.state.BrowsingMode == BrowsingModes.Grid){
      currentBrowser = <GridBrowser cubeObjects={this.state.cubeObjects}/>
    }else if(this.state.BrowsingMode == BrowsingModes.Card){
      currentBrowser = <CardBrowser cubeObjects={this.state.cubeObjects} onBrowsingModeChanged={this.onBrowsingModeChanged}/>
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

  componentDidMount(){
    let cubeObjects: CubeObject[] = [{
      Id: 4,
      FileName: "IMG_1",
      FileType: 0,
      PhotoId: 4,
      Photo: null,
      ObjectTagRelations: null,
      ThumbnailId: 4,
      Thumbnail: null
    },
    {
      Id: 4,
      FileName: "IMG_2",
      FileType: 0,
      PhotoId: 9,
      Photo: null,
      ObjectTagRelations: null,
      ThumbnailId: 4,
      Thumbnail: null
    }
    ]
    this.setState({cubeObjects: cubeObjects, BrowsingMode:BrowsingModes.Grid});
  }

  onFileCountChanged = (fileCount: number) => {
    if(this.rightDock.current) this.rightDock.current.UpdateFileCount(fileCount);
  }

  onDimensionChanged = (dimName: string, dimension:PickedDimension) => {
    console.log("Dimension " + dimName + ", changed to: ");
    console.log(dimension);
    if(this.state.BrowsingMode == BrowsingModes.Cube){
      this.threeBrowser.current!.UpdateAxis(dimName, dimension);
    }
  }

  onBrowsingModeChanged = (browsingMode: BrowsingModes) =>{    
    if(this.state.BrowsingMode == BrowsingModes.Cube){ //Going from cube to other:
      //Saving current browsingstate:
      this.threeBrowserBrowsingState = this.threeBrowser.current!.GetCurrentBrowsingState();
      this.setState({cubeObjects: this.threeBrowser.current!.GetUniqueCubeObjects()});
    }
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

  onOpenCubeInCardMode = (cubeObjects: CubeObject[]) => {
    console.log("Opening cube in card mode:");
    this.threeBrowserBrowsingState = this.threeBrowser.current!.GetCurrentBrowsingState();
    this.setState({cubeObjects: cubeObjects});
    this.setState({BrowsingMode: BrowsingModes.Card});
  }
}