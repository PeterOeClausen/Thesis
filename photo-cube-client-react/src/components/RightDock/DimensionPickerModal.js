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
        fetchedTagsets: [],
        fetchedHierarchies: []
    };

    onOpenModal = () => {
        this.fetchTagsets();
        this.fetchHierarchies();
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    render() {
        const { open } = this.state;
        return (
            <div>
                <button onClick={this.onOpenModal}>Choose</button>
                <Modal open={open} onClose={this.onCloseModal} center>
                    <h2>Pick a tagset or a hierarchy to show as a dimension</h2>
                    <h3>Tagsets</h3>
                    { this.renderTagsets() }
                    <h3>Hierarchies</h3>
                    { this.renderHierachies() }
                </Modal>
            </div>
        );
    }

    renderTagsets(){
        return (
            <ul>
                {this.state.fetchedTagsets.map(ts => {
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

    renderHierachies(){
        return (
            <ul>
                {this.state.fetchedHierarchies.map(h => {
                    return( 
                        <li key={h.HierarchyId}>
                            <button onClick={() => {
                                this.props.onDimensionPicked({type:"hierarchy", id:h.HierarchyId, name:h.Name});
                                this.onCloseModal();
                            }}>{h.Name}</button>
                        </li> 
                    )
                })}
            </ul>
        );
    }

    fetchTagsets(){
        //Using this guide: https://blog.hellojs.org/fetching-api-data-with-react-js-460fe8bbf8f2
        //Fetching tagsets:
        fetch("https://localhost:44317/api/tagset")
        .then(result => {return result.json();})
        .then(data => {
            let tagset = data.map((ts) => { return {"Name": ts.Name, "TagsetId": ts.Id}} );
            tagset.sort((a,b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0);
            this.setState( {fetchedTagsets: tagset} );
        });
    }

    fetchHierarchies(){
        fetch("https://localhost:44317/api/hierarchy")
        .then(result => {return result.json();})
        .then(data => {
            let hierarchies = data.map((h) => { return {"Name": h.Name, "HierarchyId": h.Id} });
            hierarchies.sort((a,b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0);
            this.setState( {fetchedHierarchies: hierarchies} );
        });
    }
}

export default DimensionPickerModal;