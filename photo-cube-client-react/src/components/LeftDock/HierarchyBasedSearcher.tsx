import React from 'react';
import { Filter } from './FacetedSearcher';
import Fetcher from '../Middle/ThreeBrowser/Fetcher';
import Hierarchy from '../Middle/ThreeBrowser/Hierarchy';
import HierarchyNode from '../Middle/ThreeBrowser/HierarchyNode';

export default class HierarchyBasedSearcher extends React.Component<{
    onFiltersChanged : (filters:Filter[]) => void,
    className: string
}>{
    state = {
        hierarchies: []
    }

    //The unique set of filters currently active:
    activeFilters : Set<Filter> = new Set();

    render(){
        return(
            <div className="scrollable2">
                {this.state.hierarchies}
            </div>
        );
    }

    componentDidMount(){
        this.renderHierarchies()
    }

    /**
     * todo: Update:
     * 
     * Fetches tagsets and tags from the server, and pressents them with a checkbox.
     * If the checkbox is checked or unchecked, this.onChange is called, and the filter
     * is added to activaFilters.
     */
    private async renderHierarchies(){
        let renderedHierarchies = await Fetcher.FetchHierarchies()
            .then((hierarchies:Hierarchy[]) => {
                return hierarchies
                    .sort((h1,h2) => h1.Name.localeCompare(h2.Name))    //Sort hiererarchies
                    .map((h:Hierarchy) => {                               //Map each tagset to JSX element
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

    private renderNode(node: HierarchyNode, level: number){
        let nodeLevelClassName : string = "nodeLevel-"+level;
        let result = <div key={"Node:" + node.Tag.Id + ", level: " + level}>
            <p className={nodeLevelClassName}>
                {node.Tag.Name}
                <input
                    type="checkbox"
                    name={"hierarchy"}
                    value={node.Id}
                    onChange={e => this.onChange(e)}
                    />
            </p>
            { node.Children.map(cn => this.renderNode(cn, level + 1)) }
        </div>
        return result;
    }

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

    //

    /**
     * 
     {
                                h.Nodes!
                                .sort((n1,n2) => n1.Tag.Name.localeCompare(n2.Tag.Name)) //Sort Nodes
                                .map(t => 
                                    <div key={t.Id}>
                                        <p>
                                            {t.Name}
                                            <input
                                                type="checkbox"
                                                name={"tag"}
                                                value={t.Id}
                                                onChange={e => this.onChange(e)}/>
                                        </p>
                                        <br/>
                                    </div>
                                )
                            }
     */

}