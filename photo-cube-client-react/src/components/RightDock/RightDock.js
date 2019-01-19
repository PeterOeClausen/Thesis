import React, { Component } from 'react';
import '../../css/RightDock.css'
import FileCount from './FileCount';
import BrowsingModeChanger from './BrowsingModeChanger';
import Dimensions from './Dimensions';

class RightDock extends Component{
    render(){
        return(
            <div id="RightDock">
                <FileCount/>
                <BrowsingModeChanger/>
                <Dimensions/>
            </div>
        );
    }
}

export default RightDock;