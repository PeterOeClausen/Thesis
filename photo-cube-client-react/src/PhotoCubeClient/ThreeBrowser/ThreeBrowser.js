import React, { Component } from 'react';
import './ThreeBrowser.css';

class ThreeBrowser extends Component{
    constructor(props){
        super(props);
        
    }

    render(){
        return(
            <div className="grid-item" id="ThreeBrowser">
                { /* Canvas is added in here */ }
            </div>
        );
    }
}

export default ThreeBrowser;