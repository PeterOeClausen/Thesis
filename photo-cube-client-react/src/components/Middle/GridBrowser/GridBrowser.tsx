import React, { Component, SyntheticEvent } from 'react';
import '../../../css/GridBrowser.css';
import CubeObject from '../ThreeBrowser/CubeObject';
import Fetcher from '../ThreeBrowser/Fetcher';
import { BrowsingModes } from '../../RightDock/BrowsingModeChanger';

export default class GridBrowser extends React.Component<{
    cubeObjects: CubeObject[],
    onBrowsingModeChanged: (browsingMode: BrowsingModes) => void
}>{
    render(){
        let images = this.props.cubeObjects.map((co, index) => <img 
            key={"image-"+index} 
            className="image" 
            src={Fetcher.GetPhotoURL(co.PhotoId)}
            ></img>)

        return(
            <div className="grid-item">
                <p>GridBrowser!</p>
                <div className="imageContainer">
                    {images}
                </div>
            </div>
        );
    }

    componentDidMount(){
        document.addEventListener("keydown", (e) => this.onKeydown(e));
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", (e) => this.onKeydown(e));
    }

    onKeydown(e: KeyboardEvent){
        //console.log(e.key);
        if(e.key == "Escape"){
            this.props.onBrowsingModeChanged(BrowsingModes.Cube);
        }
    }
}