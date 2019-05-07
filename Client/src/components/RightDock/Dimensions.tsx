import React, { Component } from 'react';
import '../../css/Dimensions.css';
import Dimension from './Dimension';
import PickedDimension from './PickedDimension';

/**
 * Container for Dimension.
 * Used in RightDock.
 */
export default class Dimensions extends Component<{
    onDimensionChanged:(dimName: string, dimension:PickedDimension) => void,
    onClearAxis:(axisName: string) => void,
    className: string
    }>{

    render(){
        return(
            <div className={this.props.className}>
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