import React, { Component } from 'react';
import '../../css/Dimensions.css'
import DimensionPickerModal from './DimensionPickerModal';

/**
 * Component repressenting a Dimension, can be either X, Y or Z.
 * 
 * Used in RightDock to choose values for dimensions.
 */
class Dimension extends Component{
    constructor(props){
        super(props);
        this.state = {
            DimensionType: null,
            DimensionId: null,
            DimensionName: null,
        };
    }
    
    render(){
        return(
            <div>
                <p>{this.props.xyz}-Axis:</p><br/>
                {this.renderDimensionTypeAndName()}
                <DimensionPickerModal onDimensionPicked={this.dimensionPicked}/>
            </div>
        );
    }

    renderDimensionTypeAndName(){
        if(this.state.DimensionType != null){
            return (<p>{this.state.DimensionType}:{this.state.DimensionName}</p>);
        }else{
            return (<p>Choose a dimension...</p>)
        }
    }

    dimensionPicked = (dimension) => {
        this.setState({
            DimensionType:  dimension.type, 
            DimensionId:    dimension.id, 
            DimensionName:  dimension.name
        });
        this.props.onDimensionChanged(this.props.xyz, dimension);
    }

    /* NOT IN USE
    changeDimensionClicked(){
        //Using this guide: https://blog.hellojs.org/fetching-api-data-with-react-js-460fe8bbf8f2
        //Fetching tagsets:
        fetch("https://localhost:44317/api/tagset")
        .then(result => {return result.json();})
        .then(data => {
            //Use map instead
            this.setState({TagSets: data});
            console.log(this.state.TagSets);
            let listOfNames = data.map((ts) => { return {"Name": ts.Name, "TagsetId": ts.Id} });
            console.log(listOfNames);
        });
    }*/
}

export default Dimension;