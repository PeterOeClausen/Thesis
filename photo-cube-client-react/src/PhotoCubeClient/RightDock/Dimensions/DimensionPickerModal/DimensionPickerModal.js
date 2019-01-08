import React, { Component } from 'react';
import Modal from "react-responsive-modal"; //https://www.npmjs.com/package/react-responsive-modal

/**
 * A component containing a Modal for picking Dimensions.
 * 
 * The user can choose between tagsets or hierarchies.
 * 
 * It returns an object to given callback-function called onDimensionPicked().
 * The object given to onDimensionPicked contains either:
 * 
 * - Tagset: {type:"tagset", id:ts.TagsetId, name:ts.Name}
 * 
 * - Hierarchy: {type:"hierarchy", id:h.HirarchyId, name:h.Name}.
 * 
 * The Dimension is then to be shown in the ThreeBrowser.
 */
class DimensionPickerModal extends Component{
    state = {
        open: false,
        listOfTagsetNames: []
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    //<button onClick={this.onOpenModal}>Open modal</button>

    render() {
        const { open } = this.state;
        return (
            <div>
                <button onClick={this.onOpenModal}>Choose</button>
                <Modal open={open} onClose={this.onCloseModal} center>
                    <h2>Pick a tagset or a hierarchy to show as a dimension</h2>
                    <h3>Tagsets</h3>
                    { this.getAndRenderTagsets() }
                    <h3>Hierarchies</h3>
                </Modal>
            </div>
        );
    }

    getAndRenderTagsets(){
        //Using this guide: https://blog.hellojs.org/fetching-api-data-with-react-js-460fe8bbf8f2
        //Fetching tagsets:
        fetch("https://localhost:44317/api/tagset")
        .then(result => {return result.json();})
        .then(data => {
            //Use map instead
            this.setState( {listOfTagsetNames: data.map((ts) => { return {"Name": ts.Name, "TagsetId": ts.Id} }) } );
        });
        return (
            <ul>
                {this.state.listOfTagsetNames.map(ts => {
                    return( 
                        <li key={ts.TagsetId}>
                            <button onClick={() => {
                                this.props.onDimensionPicked({type:"tagset", id:ts.TagsetId, name:ts.Name});
                                this.onCloseModal();
                            }}>{ts.Name}</button>
                        </li> 
                    )
                })}
            </ul>
        );
    }
}

export default DimensionPickerModal;