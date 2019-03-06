import React, { Component } from 'react';
import '../../css/BrowsingStateLoader.css'

class BrowsingStateLoader extends Component<{
        className: string
    }>{
    render() {
        return (
            <div id="BrowsingState" className={this.props.className}>
                <h4 className="MenuHeader">Browsing state</h4>
                <button className="MenuButton">New browsing state</button>
                <button className="MenuButton">Save browsing state</button>
                <button className="MenuButton">Load browsing state</button>
            </div>		
        );
    }
}

export default BrowsingStateLoader;