import React, { Component, SyntheticEvent } from 'react';
import CubeObject from '../ThreeBrowser/CubeObject';
import Fetcher from '../ThreeBrowser/Fetcher';
import '../../../css/CardBrowser.css';
import { BrowsingModes } from '../../RightDock/BrowsingModeChanger';
import Tag from '../ThreeBrowser/Tag';

export default class CardBrowser extends React.Component<{
    cubeObjects: CubeObject[],
    onBrowsingModeChanged : (browsingMode: BrowsingModes) => void
}>{
    state = {
        photoIndex: 0,
        currentPhotoClassName: "",
        spinnerVisibility: "hidden",
        photoVisibility: "visible",
        tagNamesWithCubeObjectId: ""
    }

    render(){
        if(this.props.cubeObjects.length > 0){
            let fileName: string = "";
            if(this.props.cubeObjects[this.state.photoIndex].FileName) {
                fileName = this.props.cubeObjects[this.state.photoIndex].FileName!;
            }
            return(
                <div className="grid-item cardBrowserContainer">
                    <div>
                        <p>{"Showing photo: " + (this.state.photoIndex + 1) + " out of " + this.props.cubeObjects.length}</p><br/>
                        <p>Filename: {fileName}</p><br/>
                        <p>Tags: {this.state.tagNamesWithCubeObjectId}.</p>
                    </div>
                    <div className="currentPhotoContainer">
                        <img id="currentPhoto" 
                            className={this.state.currentPhotoClassName + " " + this.state.photoVisibility} 
                            onLoad={(e) => this.onImageLoad(e)} 
                            src={Fetcher.GetPhotoURL(this.props.cubeObjects[this.state.photoIndex].PhotoId)}></img>
                    </div>        
                </div>
            );
        }
        else{
            return( <div className="grid-item cardBrowserContainer currentPhotoContainer">
                <p>Please choose some photos first.</p>
            </div>);
        }
    }

    private async updateTagsInState() {
        if(this.props.cubeObjects.length > 0){
            await Fetcher.FetchTagsWithCubeObjectId(this.props.cubeObjects[this.state.photoIndex].Id)
            .then((tags:Tag[]) => {
                let result : string = "";
                tags.forEach(t => result += t.Name + ", ");
                this.setState({tagNamesWithCubeObjectId: result.substring(0, result.length - 2)})
            });
        }   
    }

    componentDidMount(){
        document.addEventListener("keydown", (e) => this.onKeydown(e));
        this.updateTagsInState();
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", (e) => this.onKeydown(e));
    }

    onImageLoad(e: SyntheticEvent<HTMLImageElement, Event>){
        this.setState({spinnerVisibility: "hidden"});
        if(e.currentTarget.naturalWidth > e.currentTarget.naturalHeight){
            this.setState({currentPhotoClassName: "landscape"});
        }else{
            this.setState({currentPhotoClassName: "portrait"});
        }
        this.setState({photoVisibility: "visible"});
    }

    onLoadStart(e: SyntheticEvent<HTMLImageElement, Event>){
        this.setState({photoVisibility: "hidden"});
        this.setState({spinnerVisibility: "visible"});
    }

    onKeydown(e: KeyboardEvent){
        //console.log(e.key);
        if(e.key == "ArrowRight"){
            if(this.state.photoIndex < this.props.cubeObjects.length - 1){
                this.setState({photoIndex: this.state.photoIndex + 1});
                this.updateTagsInState();
            }
        }else if(e.key == "ArrowLeft"){
            if(this.state.photoIndex != 0){
                this.setState({photoIndex: this.state.photoIndex - 1});
                this.updateTagsInState();
            }
        }else if(e.key == "Escape"){
            this.props.onBrowsingModeChanged(BrowsingModes.Cube);
        }
    }
}