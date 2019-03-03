import React, { Component, SyntheticEvent } from 'react';
import '../../css/BrowsingModeChanger.css';

/**
 * BrowserModeChanger is a Component where the user can pick the current browsingmode.
 */
export enum BrowsingModes{
    Cube,
    Grid,
    Card
}

class BrowserModeChanger extends React.Component<{
        onBrowsingModeChanged: (selectedBrowsingMode:BrowsingModes) => void
    }>{
    
    render(){
        return(
            <div id="BrowserModeChanger">
                <h4 className="Header">Browsing mode</h4>
                <div className="Content">
                    <select className="Selector" onChange={this.onSelectionChanged}>
                        <option value={BrowsingModes.Cube}>Cube</option>
                        <option value={BrowsingModes.Grid}>Grid</option>
                        <option value={BrowsingModes.Card}>Card</option>
                    </select>
                </div>
            </div>
        );
    }

    onSelectionChanged = (event: any) => {
        let {name, value} = event.target;
        console.log(value);
        this.props.onBrowsingModeChanged(value);
    }
}

export default BrowserModeChanger;