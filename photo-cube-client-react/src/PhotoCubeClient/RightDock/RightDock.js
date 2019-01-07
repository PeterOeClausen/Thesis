import React, { Component } from 'react';
import './RightDock.css'
import FileCount from './FileCount/FileCount';
import BrowsingMode from './BrowsingMode/BrowsingMode';
import Dimensions from './Dimensions/Dimensions';

class RightDock extends Component{
    render(){
        return(
            <div id="RightDock">
                <FileCount/>
                <BrowsingMode/>
                <Dimensions/>
            </div>
        );
    }
}

export default RightDock;