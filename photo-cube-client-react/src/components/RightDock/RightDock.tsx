import React, { Component } from 'react';
import '../../css/RightDock.css'
import FileCount from './FileCount';
import BrowsingModeChanger from './BrowsingModeChanger';
import Dimensions from './Dimensions';

class RightDock extends React.Component<{onDimensionChanged:(dimName: string, dimension:any) => void}>{

    private fileCount = React.createRef<FileCount>();

    constructor(props: any){
        super(props);
    }

    render(){
        return(
            <div id="RightDock">
                <FileCount ref={this.fileCount}/>
                <BrowsingModeChanger/>
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
}

export default RightDock;