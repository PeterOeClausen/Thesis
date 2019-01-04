import React, { Component } from 'react';
import './LeftDock.css'
import BrowsingState from './BrowsingState/BrowsingState';

class LeftDock extends Component{
    render() {
        return (
            <div id="LeftDock">
		  		<BrowsingState/>
				<button className="MenuButton">Edit tags</button>
	  		</div>
        );
    }
}

export default LeftDock;