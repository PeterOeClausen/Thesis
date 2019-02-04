//Not in use...

import React, { Component } from 'react';
import { observable, action, decorate, computed } from "mobx";
import { observer } from "mobx-react";

class AppStateClass {
    @observable 
    state = {
        fileCount: 0
    };

    @action
    updateFileCount() {
        this.state.fileCount = 10;
    }

    @computed
    get getFileCount() : string{
        return this.state.fileCount + "";
    }

    print(aString: string) : void{
        console.log(aString);
    }

    getString() : string{
        return "Hello!";
    }
}

export default AppStateClass;