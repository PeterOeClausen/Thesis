import React, { Component } from 'react';
import '../../css/BrowsingStateLoader.css'

class BrowsingStateLoader extends Component<{
        className: string
    }>{
    render() {
        return (
            <div id="BrowsingStateLoader" className={this.props.className}>
                <h4 className="Header">Browsing state</h4>
                <button className="MenuButton">New browsing state</button>
                <button className="MenuButton">Save browsing state</button>
                <button className="MenuButton">Load browsing state</button>
                <button className="MenuButton">Edit tags</button>
            </div>
        );
    }
}

export default BrowsingStateLoader;