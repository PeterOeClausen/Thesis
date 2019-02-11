import React, { Component } from 'react';
import '../../css/LeftDock.css'
import BrowsingStateLoader from './BrowsingStateLoader';

class LeftDock extends Component{
    render() {
        return (
            <div id="LeftDock">
		  		<BrowsingStateLoader/>
				<button className="MenuButton">Edit tags</button>
	  		</div>
        );
    }
}

export default LeftDock;