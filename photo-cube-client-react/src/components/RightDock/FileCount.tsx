import React, { Component } from 'react';
import '../../css/FileCount.css';
import { observer } from "mobx-react";
import AppState from '../ApplicationState/ApplicationState';
import ApplicationState from '../ApplicationState/ApplicationStateSingleton';

/**
 * FileCount is a Component that shows how many objects the ThreeBrowser is currently showing.
 */
@observer
class FileCount extends Component{
    
    state = {
        fileCount: 0,
    };

    componentDidMount(){
        //Subscribe to store with render function or updateFileCount as callback.
        
    }

    render(){
        return(
            <div id="FileCount">
                <h4 className="Header">File count</h4>
                <div className="Content">
                    <p>Showing: </p>
                    <p>{this.state.fileCount}</p>
                    <p> objects</p>
                    <button onClick={() => this.setState({fileCount: this.state.fileCount + 1}) }>Click</button>
                </div>
            </div>
        );
    }

    updateFileCount(count: number){
        //Istead of receiving count, it may get the application state and update state itself.
        this.setState({fileCount: count});
    }
}

export default FileCount;