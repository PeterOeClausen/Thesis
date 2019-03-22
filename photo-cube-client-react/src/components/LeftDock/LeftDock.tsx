import React, { Component } from 'react';
import '../../css/LeftDock.css';
import FacetedSearcher, { Filter } from './FacetedSearcher';

/**
 * LeftDock is the left portion of the interface.
 * PhotoCubeClient.tsx contains: LeftDock, Middle and RightDock.
 */
export default class LeftDock extends Component<{
        hideControls: boolean,
        onFiltersChanged : (filters: Filter[]) => void
    }>{
    render() {
        return (
            <div id="LeftDock">
		  		<FacetedSearcher className={this.props.hideControls ? "hide" : ""} onFiltersChanged={this.props.onFiltersChanged}/>
	  		</div>
        );
        //Not in use: let classNames = "hide" //this.props.hideControls ? "hide" : "";
        //Not in use: <BrowsingStateLoader className={classNames}/>
    }
}