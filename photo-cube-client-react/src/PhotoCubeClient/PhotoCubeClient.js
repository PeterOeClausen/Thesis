import React, { Component } from 'react';
import './PhotoCubeClient.css';
import LeftDock from './LeftDock/LeftDock';
import ThreeBrowser from './ThreeBrowser/ThreeBrowser';
import RightDock from './RightDock/RightDock';

class PhotoCubeClient extends Component {
    render() {
        return (
            <div className="App grid-container">
                <LeftDock/>
                <ThreeBrowser/>
                <RightDock/>
            </div>
        );
    }
}
    
export default PhotoCubeClient;