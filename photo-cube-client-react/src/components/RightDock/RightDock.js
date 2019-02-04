import React, { Component } from 'react';
import '../../css/RightDock.css'
import FileCount from './FileCount';
import BrowsingModeChanger from './BrowsingModeChanger';
import Dimensions from './Dimensions';

class RightDock extends Component{
    render(){
        return(
            <div id="RightDock">
                <FileCount appState={this.props.appState}/>
                <BrowsingModeChanger/>
                <Dimensions onDimensionChanged={this.onDimensionChanged}/>
            </div>
        );
    }

    onDimensionChanged = (dimName, dimension) => {
        this.props.onDimensionChanged(dimName, dimension);
        //ThreeBrowserController.getInstance().sayHello();
    }
}

export default RightDock;