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
    state = {
        selectedBrowsingMode: BrowsingModes.Cube
    }

    render(){
        return(
            <div id="BrowserModeChanger">
                <h4 className="Header">Browsing mode</h4>
                <div className="Content">
                    <select className="Selector" onChange={this.onSelectionChanged} value={this.state.selectedBrowsingMode}>
                        <option value={BrowsingModes.Cube}>Cube</option>
                        <option value={BrowsingModes.Grid}>Grid</option>
                        <option value={BrowsingModes.Card}>Card</option>
                    </select>
                </div>
            </div>
        );
    }

    onSelectionChanged = (event: any) => {
        event.target.blur(); //Remove focus after selection, so that user don't accidentally changes it again.
        this.ChangeSelectedBrowsingMode(event.target.value);
        this.props.onBrowsingModeChanged(event.target.value);
    }

    ChangeSelectedBrowsingMode(browsingMode: BrowsingModes){
        this.setState({selectedBrowsingMode: browsingMode});
    }
}

export default BrowserModeChanger;