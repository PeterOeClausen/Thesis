import React, { Component } from 'react';
import '../../css/RightDock.css'
import FileCount from './FileCount';
import BrowsingModeChanger, { BrowsingModes } from './BrowsingModeChanger';
import Dimensions from './Dimensions';
import Hierarchy from '../Middle/ThreeBrowser/Hierarchy';
import Tagset from '../Middle/ThreeBrowser/Tagset';

class RightDock extends React.Component<{
    onDimensionChanged:(dimName: string, dimension:Tagset|Hierarchy) => void,
    onBrowsingModeChanged:(browsingmode: BrowsingModes) => void
    }>{

    private fileCount = React.createRef<FileCount>();

    constructor(props: any){
        super(props);
    }

    render(){
        return(
            <div id="RightDock">
                <FileCount ref={this.fileCount}/>
                <BrowsingModeChanger onBrowsingModeChanged={this.onBrowsingModeChanged} />
                <Dimensions onDimensionChanged={this.onDimensionChanged}/>
            </div>
        );
    }

    UpdateFileCount(count: number){
        this.fileCount.current!.UpdateFileCount(count);
    }

    onDimensionChanged = (dimName: string, dimension:any) => {
        this.props.onDimensionChanged(dimName, dimension);
        //ThreeBrowserController.getInstance().sayHello();
    }

    onBrowsingModeChanged = (selectedBrowsingMode: BrowsingModes) => {
        console.log(selectedBrowsingMode);
        this.props.onBrowsingModeChanged(selectedBrowsingMode);
    }
}

export default RightDock;