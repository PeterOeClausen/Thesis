import React, { Component } from 'react';
import './BrowsingMode.css';

class BrowserModeChanger extends Component{
    
    render(){
        return(
            <div id="BrowserModeChanger">
                <h4 className="Header">Browsing mode</h4>
                <div className="Content">
                    <select className="Selector">
                        <option value="Cube">Cube</option>
                        <option value="Grid">Grid</option>
                        <option value="Card">Card</option>
                    </select>
                </div>
               
            </div>
        );
    }
}

export default BrowserModeChanger;