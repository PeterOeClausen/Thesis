import React, { Component } from 'react';

const ThreeBrowserContext = React.createContext()

class MyProvider extends Component{
    state = {
        name: 'Wes'
    }

    render(){
        return(
            <ThreeBrowserContext.Provider value='A context value'>
                {this.props.children}
            </ThreeBrowserContext.Provider>
        )
    }
}

export default MyProvider;