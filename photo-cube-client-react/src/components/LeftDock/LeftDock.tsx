import React, { Component } from 'react';
import '../../css/LeftDock.css'
import BrowsingStateLoader from './BrowsingStateLoader';
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
        let classNames = "hide" //this.props.hideControls ? "hide" : "";
        return (
            <div id="LeftDock">
		  		<FacetedSearcher className={this.props.hideControls ? "hide" : ""} onFiltersChanged={this.props.onFiltersChanged}/>
	  		</div>
        );
        //<BrowsingStateLoader className={classNames}/>
    }
}