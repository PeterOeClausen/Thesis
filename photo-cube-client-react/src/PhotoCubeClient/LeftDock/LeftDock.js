import React, { Component } from 'react';
import './LeftDock.css'

class LeftDock extends Component{
    render() {
        return (
            <div className="grid-item controls" id="leftDock">
		  		<div id="menu" className="control">
					<h4>Menu</h4>
					<button className="menuButton">New browsing state</button>
					<button className="menuButton">Save browsing state</button>
					<button className="menuButton">Load browsing state</button>
					<button className="menuButton">Edit tags</button>
		  		</div>
	  		</div>
        );
    }
}

export default LeftDock;