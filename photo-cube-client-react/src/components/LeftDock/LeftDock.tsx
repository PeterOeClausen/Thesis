import React, { Component } from 'react';
import '../../css/LeftDock.css'
import BrowsingStateLoader from './BrowsingStateLoader';

class LeftDock extends Component<{
        hideControls: boolean
    }>{
    render() {
        let classNames = this.props.hideControls ? "hide" : "";
        return (
            <div id="LeftDock">
		  		<BrowsingStateLoader className={classNames}/>
				<button className={"MenuButton " + classNames}>Edit tags</button>
	  		</div>
        );
    }
}

export default LeftDock;