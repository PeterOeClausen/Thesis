import React, { Component } from 'react';
import '../../css/Dimensions.css'
import DimensionPickerModal from './DimensionPickerModal';
import PickedDimension from './PickedDimension';

/**
 * Component repressenting a Dimension, can be either X, Y or Z.
 * 
 * Used in RightDock to choose values for dimensions.
 */
class Dimension extends Component<{
    xyz: string,
    onDimensionChanged:(dimName: string, dimension:PickedDimension) => void,
    onClearAxis: (axisName:string) => void
    }>{

    state = {
        DimensionType: null,
        DimensionId: null,
        DimensionName: null,
    };
    
    render(){
        return(
            <div>
                <p>{this.props.xyz}-Axis:</p><br/>
                {this.renderDimensionTypeAndName()}
                <div className="width100">
                    <div className="displayInline width50"><DimensionPickerModal onDimensionPicked={this.dimensionPicked}/></div>
                    <div className="displayInline width50"><button className="width100" onClick={() => this.props.onClearAxis(this.props.xyz)}>Clear</button></div>
                </div>
            </div>
        );
    }

    renderDimensionTypeAndName(){
        if(this.state.DimensionType != null){
            return (<p>{this.state.DimensionName} ({this.state.DimensionType})</p>);
        }else{
            return (<p>Choose a dimension...</p>)
        }
    }

    dimensionPicked = (dimension:PickedDimension) => {
        this.setState({
            DimensionType:  dimension.type, 
            DimensionId:    dimension.id, 
            DimensionName:  dimension.name
        });
        this.props.onDimensionChanged(this.props.xyz, dimension);
    }
}

export default Dimension;