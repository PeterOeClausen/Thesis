import React, { Component } from 'react';
import '../../css/BrowsingStateLoader.css'

/**
 * Not in use. But couæd be used to save and load browsing states:
 */
export default class BrowsingStateLoader extends Component<{
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