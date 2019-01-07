import React, { Component } from 'react';

class Dimension extends Component{
    constructor(props){
        super(props);
        this.state = {
            DimensionId: null,
            DimensionName: "null",
            TagSets: []
        };
    }
    
    render(){
        return(
            <div>
                <p>{this.props.xyz}-Axis:</p><br/>
                <p>Showing: {this.state.DimensionName}</p>
                <button onClick={() => this.changeDimensionClicked()}>Change</button>
                <ul id="DimensionList">
                    <li>qwerty</li>
                </ul>
            </div>
        );
    }

    changeDimensionClicked(){
        //Using this guide: https://blog.hellojs.org/fetching-api-data-with-react-js-460fe8bbf8f2
        //Fetching tagsets:
        fetch("https://localhost:44317/api/tagset")
        .then(result => {return result.json();})
        .then(data =>{
            //Use map instead
            this.setState({TagSets: data});
            console.log(this.state.TagSets);
        });
    }
}

export default Dimension;