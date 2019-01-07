import React, { Component } from 'react';
import './Dimensions.js';
import Dimension from './Dimension';

class Dimensions extends Component{
    render(){
        return(
            <div>
                <h4 className="Header">Dimensions</h4>
                <Dimension xyz="X"/>
                <Dimension xyz="Y"/>
                <Dimension xyz="Z"/>
            </div>
        );
    }
}

export default Dimensions;