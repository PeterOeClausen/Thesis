import React, { Component, SyntheticEvent } from 'react';
import '../../../css/GridBrowser.css';
import CubeObject from '../ThreeBrowser/CubeObject';
import Fetcher from '../ThreeBrowser/Fetcher';

export default class GridBrowser extends React.Component<{
    cubeObjects: CubeObject[]
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
}