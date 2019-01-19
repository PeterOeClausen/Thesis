import React, { Component } from 'react';
import './Dimensions.js';
import Dimension from './Dimension';
import ThreeBrowserController from './../../ThreeBrowser/ThreeBrowserController';
import {MyContext} from '../../../components/PhotoCubeClient';

class Dimensions extends Component{
    render(){
        return(
            <div>
                <h4 className="Header">Dimensions</h4>
                <Dimension xyz="X" onDimensionChanged={this.HandleDimensionChanged}/>
                <Dimension xyz="Y"/>
                <Dimension xyz="Z"/>
                <MyContext.Consumer>
                    {(context) => (
                        <React.Fragment>
                        <p>Name: {context.state.name}</p>
                        <p>Age: {context.state.age}</p>
                        <button onClick={context.growAYearOlder}>grow</button>
                        </React.Fragment>
                    )}
                </MyContext.Consumer>
            </div>
        );
    }

    HandleDimensionChanged = (dimName, dimension) => {
        console.log("Dimension changed: " + dimName + ":");
        console.log(dimension);
        ThreeBrowserController.getInstance().sayHello();
    }
}

export default Dimensions;