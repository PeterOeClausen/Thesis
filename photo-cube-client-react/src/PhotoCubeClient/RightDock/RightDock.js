import React, { Component } from 'react';
import './RightDock.css'
import FileCount from './FileCount/FileCount';
import BrowsingMode from './BrowsingMode/BrowsingMode';

class RightDock extends Component{
    render(){
        return(
            <div id="RightDock">
                <FileCount/>
                <BrowsingMode/>
            </div>
        );
    }
}

export default RightDock;