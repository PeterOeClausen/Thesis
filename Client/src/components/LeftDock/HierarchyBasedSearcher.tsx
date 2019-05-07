import React from 'react';
import { Filter } from './FacetedSearcher';
import Fetcher from '../Middle/ThreeBrowser/Fetcher';
import Hierarchy from '../Middle/ThreeBrowser/Hierarchy';
import HierarchyNode from '../Middle/ThreeBrowser/HierarchyNode';

/**
 * Hierarchy based faceted search component.
 * Let's the user pick hierarchies which the photos are tagged with.
 * If a photo is tagged with at least one tag in a hierarchy, it passes through the filter.
 */
export default class HierarchyBasedSearcher extends React.Component<{
    onFiltersChanged : (filters:Filter[]) => void,
    className: string
}>{
    state = {
        hierarchies: []
    }

    //The unique set of filters currently active:
    activeFilters : Set<Filter> = new Set();
    inputElements : any[] = [];

    render(){
        return(
            <div className="scrollable2">
                {this.state.hierarchies}
            </div>
        );
    }

    componentDidMount(){
        this.renderHierarchies();
    }

    /**
     * Fetches Hierarchies and nodes from the server, and presents them with a checkbox.
     * If the checkbox is checked or unchecked, this.onChange is called, and the filter
     * is added to activaFilters.
     */
    private async renderHierarchies(){
        let renderedHierarchies = await Fetcher.FetchHierarchies()
            .then((hierarchies:Hierarchy[]) => {
                return hierarchies
                    .sort((h1,h2) => h1.Name.localeCompare(h2.Name))    //Sort hiererarchies
                    .map((h:Hierarchy) => {                             //Map each tagset to JSX element
                        return <div key={h.Id}>
                            <p className="hierarchyName">{h.Name + " (hierarchy):"}</p>
                            <br/>
                            {this.renderNode(h.Nodes.find(n => n.Id == h.RootNodeId)!, 0)}
                            <hr/>
                        </div>;
                    });
            });
        this.setState({hierarchies: renderedHierarchies});
    }

    /**
     * Recursively renders hierarchy nodes and checkboxes.
     * @param node 
     * @param level 
     */
    private renderNode(node: HierarchyNode, level: number){
        let nodeLevelClassName : string = "nodeLevel-"+level;
        let inputElement = <input
            type="checkbox"
            name={"hierarchy"}
            value={node.Id}
            onChange={e => this.onChange(e)}/>;
        this.inputElements.push(inputElement);
        let result = <div key={"Node:" + node.Tag.Id + ", level: " + level}>
            <p className={nodeLevelClassName}>
                {node.Tag.Name}
                {inputElement}
            </p>
            { node.Children.map(cn => this.renderNode(cn, level + 1)) }
        </div>
        return result;
    }

    /**
     * If a checkbox is checked, this method is called.
     * Adds a filter corresponding to the hierarchy, and calls this.props.onFiltersChanged.
     * @param e 
     */
    private onChange(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.checked){
            //Add filter
            this.activeFilters.add( { type: e.target.name, tagId: 0, nodeId: parseInt(e.target.value) } );
            //Notify parent component of change:
            this.props.onFiltersChanged(Array.from(this.activeFilters));
        }else{
            //Removing filter (activeFilters.remove() didn't work, this is a workaround):
            let newSet : Set<Filter> = new Set();
            this.activeFilters.forEach(f => { if(f.nodeId != parseInt(e.target.value)) newSet.add(f) });
            this.activeFilters = newSet;
            //Notify parent component of change:
            this.props.onFiltersChanged(Array.from(this.activeFilters));
        }
    }

    /**
     * Clear filters, not currently used...
     */
    public ClearFilters(){
        this.activeFilters = new Set();
        //this.renderHierarchies();
        //this.inputElements.forEach(ie => ie.checked = false);
        this.props.onFiltersChanged(Array.from(this.activeFilters));
    }
}