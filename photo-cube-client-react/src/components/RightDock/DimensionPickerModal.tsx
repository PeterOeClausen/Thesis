import React, { Component } from 'react';
import Modal from "react-responsive-modal"; //https://www.npmjs.com/package/react-responsive-modal
import Tagset from '../Middle/ThreeBrowser/Tagset';
import Hierarchy from '../Middle/ThreeBrowser/Hierarchy';
import '../../css/Dimensions.css'
import PickedDimension from './PickedDimension';
import Fetcher from '../Middle/ThreeBrowser/Fetcher';

/**
 * A component containing a Modal (popup) for picking Dimensions.
 * 
 * The user can choose between hierarchies or tagsets.
 * 
 * It returns an object to given callback-function called onDimensionPicked().
 * The object given to onDimensionPicked contains either:
 * - Tagset: {type:"tagset", id:ts.TagsetId, name:ts.Name}
 * - Hierarchy: {type:"hierarchy", id:h.HirarchyId, name:h.Name}.
 * 
 * The Dimension is then to be shown in the ThreeBrowser.
 */
class DimensionPickerModal extends Component<{
    onDimensionPicked : (dimension:PickedDimension) => void
    }>{
    
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
                <button className="width100" onClick={this.onOpenModal}>Choose</button>
                <Modal open={open} onClose={this.onCloseModal} center>
                    <h2>Pick a hierarchy or a tagset to show as a dimension</h2>
                    <h3>Hierarchies</h3>
                    { this.renderHierachies() }
                    <h3>Tagsets</h3>
                    { this.renderTagsets() }
                </Modal>
            </div>
        );
    }

    renderTagsets(){
        return (
            <ul>
                {this.state.fetchedTagsets.map((ts: any) => {
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
                {this.state.fetchedHierarchies.map((h: any) => {
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
        fetch(Fetcher.baseUrl + "tagset")
        .then(result => {return result.json();})
        .then(data => {
            let tagset = data.map((ts : Tagset) => { return {"Name": ts.Name, "TagsetId": ts.Id}} );
            tagset.sort((a:any,b:any) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0);
            this.setState( {fetchedTagsets: tagset} );
        });
    }

    fetchHierarchies(){
        fetch(Fetcher.baseUrl + "hierarchy")
        .then(result => {return result.json();})
        .then(data => {
            let hierarchies = data.map((h: Hierarchy) => { return {"Name": h.Name, "HierarchyId": h.Id} });
            hierarchies.sort((a:any,b:any) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0);
            this.setState( {fetchedHierarchies: hierarchies} );
        });
    }
}

export default DimensionPickerModal;