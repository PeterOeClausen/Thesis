import React, { Component } from 'react';
import '../../css/Dimensions.css';
import Dimension from './Dimension';
import Tagset from '../Middle/ThreeBrowser/Tagset';
import Hierarchy from '../Middle/ThreeBrowser/Hierarchy';
import PickedDimension from './PickedDimension';
//import {MyContext} from '../Middle/PhotoCubeClient';

class Dimensions extends Component<{
    onDimensionChanged:(dimName: string, dimension:PickedDimension) => void,
    onClearAxis:(axisName: string) => void
    }>{

    render(){
        return(
            <div>
                <h4 className="Header">Dimensions</h4>
                <div className="Container">
                    <Dimension xyz="X" onDimensionChanged={this.props.onDimensionChanged} onClearAxis={this.props.onClearAxis}/>
                    <Dimension xyz="Y" onDimensionChanged={this.props.onDimensionChanged} onClearAxis={this.props.onClearAxis}/>
                    <Dimension xyz="Z" onDimensionChanged={this.props.onDimensionChanged} onClearAxis={this.props.onClearAxis}/>
                </div>
            </div>
        );
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