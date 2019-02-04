import React, { Component } from 'react';
import '../../css/Dimensions.css';
import Dimension from './Dimension';
import ThreeBrowserController from '../Middle/ThreeBrowserController';
//import {MyContext} from '../Middle/PhotoCubeClient';

class Dimensions extends Component{
    render(){
        return(
            <div>
                <h4 className="Header">Dimensions</h4>
                <Dimension xyz="X" onDimensionChanged={this.onDimensionChanged}/>
                <Dimension xyz="Y" onDimensionChanged={this.onDimensionChanged}/>
                <Dimension xyz="Z" onDimensionChanged={this.onDimensionChanged}/>
            </div>
        );
    }

    onDimensionChanged = (dimName, dimension) => {
        this.props.onDimensionChanged(dimName, dimension);
        //ThreeBrowserController.getInstance().sayHello();
    }
}

/*<MyContext.Consumer>
                    {(context) => (
                        <React.Fragment>
                        <p>Name: {context.state.name}</p>
                        <p>Age: {context.state.age}</p>
                        <button onClick={context.growAYearOlder}>grow</button>
                        </React.Fragment>
                    )}
                </MyContext.Consumer> */

export default Dimensions;