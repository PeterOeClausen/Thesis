import React, { Component } from 'react';
import '../../css/RightDock.css';
import FileCount from './FileCount';
import BrowsingModeChanger, { BrowsingModes } from './BrowsingModeChanger';
import Dimensions from './Dimensions';
import HierarchyBrowser from './HierarchyBrowser';
import PickedDimension from './PickedDimension';

class RightDock extends React.Component<{
        //Props contract:
        onDimensionChanged:(dimName: string, dimension:PickedDimension) => void,
        onBrowsingModeChanged:(browsingmode: BrowsingModes) => void,
        onClearAxis:(axisName: string) => void,
        hideControls: boolean
    }>{

    private fileCount = React.createRef<FileCount>();
    private hierarchyBrowser = React.createRef<HierarchyBrowser>();
    private browsingModeChanger = React.createRef<BrowsingModeChanger>();

    constructor(props: any){
        super(props);
    }

    render(){
        let visibility: string = this.props.hideControls ? "hide" : "";
        return(
            <div id="RightDock">
                <FileCount className={visibility} ref={this.fileCount}/>
                <BrowsingModeChanger ref={this.browsingModeChanger} onBrowsingModeChanged={this.props.onBrowsingModeChanged} />
                <Dimensions className={visibility} onDimensionChanged={this.onDimensionChanged} onClearAxis={this.props.onClearAxis}/>
                <HierarchyBrowser className={visibility} ref={this.hierarchyBrowser} onDimensionChanged={this.onDimensionChanged}/>
            </div>
        );
    }

    UpdateFileCount(count: number){
        this.fileCount.current!.UpdateFileCount(count);
    }

    onDimensionChanged = (dimName: string, dimension:PickedDimension) => {
        this.props.onDimensionChanged(dimName, dimension);
        if(dimension.type == "hierarchy"){
            if(this.hierarchyBrowser.current) this.hierarchyBrowser.current.RenderHierarchy(dimName, dimension);
        }else if(dimension.type == "tagset"){
            if(this.hierarchyBrowser.current) this.hierarchyBrowser.current.ClearHierarchy(dimName);
        }
        //ThreeBrowserController.getInstance().sayHello();
    }

    onClearAxis = (axisName: string) => {
        //Doesn't work, don't know why:
        if(this.hierarchyBrowser.current){ this.hierarchyBrowser.current.ClearHierarchy(axisName); }
        this.props.onClearAxis(axisName);
    }

    ChangeBrowsingMode = (browsingMode:BrowsingModes) => {
        this.browsingModeChanger.current!.ChangeSelectedBrowsingMode(browsingMode);
    }
}

export default RightDock;