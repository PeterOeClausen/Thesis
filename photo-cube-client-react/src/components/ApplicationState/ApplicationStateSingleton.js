//Not in use...

import React from 'react';

class ApplicationStateSingleton{
    state = {
        fileCount: 0
    }

    getFileCount(){
        return this.state.fileCount;
    }

    changeFileCount(){
        this.state.fileCount = 10;
        console.log(this.state.fileCount);
    }
}

const ApplicationState = new ApplicationStateSingleton();

export default ApplicationState;