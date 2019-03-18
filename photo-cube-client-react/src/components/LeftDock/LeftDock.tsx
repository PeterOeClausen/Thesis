import React, { Component } from 'react';
import '../../css/LeftDock.css'
import BrowsingStateLoader from './BrowsingStateLoader';

/**
 * LeftDock is the left portion of the interface.
 * PhotoCubeClient.tsx contains: LeftDock, Middle and RightDock.
 */
export default class LeftDock extends Component<{
        hideControls: boolean
    }>{
    render() {
        let classNames = "hide" //this.props.hideControls ? "hide" : "";
        return (
            <div id="LeftDock">
		  		<BrowsingStateLoader className={classNames}/>
	  		</div>
        );
    }
}