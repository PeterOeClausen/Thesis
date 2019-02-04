//Not in use...

import React, { Component } from 'react';
import { observable, action, decorate, computed } from "mobx";
import { observer } from "mobx-react";

@observer
class AppStateExample extends Component {
    
    @observable 
    state = {
        count: 0,
        fileCount: 0
    };

    componentDidMount(){
        setInterval(() => {
            this.state.count += 1;
        }, 1000);
    }

    @action
    reset() {
        this.state.count = 0;
    }

    @action
    updateFileCount() {
        this.state.fileCount = 10;
    }

    @computed get getTime(){
        return this.state.count;
    }

    print(aString: string){
        console.log(aString);
    }

    render(){
        return(
            <div>
                <button onClick={() => this.reset()}>Seconds passed: {this.getTime}</button>
                <button onClick={() => this.updateFileCount()}>Change filecount</button>
            </div>
        );
    }
}

export default AppStateExample;