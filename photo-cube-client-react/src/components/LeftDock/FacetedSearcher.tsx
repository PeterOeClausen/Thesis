import React from 'react';
import Fetcher from '../Middle/ThreeBrowser/Fetcher';
import Tagset from '../Middle/ThreeBrowser/Tagset';
import '../../css/FacetedSearcher.css';

/**
 * An interface for Filter. Now only supports tagId filtering, but can be expanded.
 */
export interface Filter{
    type: string,
    tagId: number
}

/**
 * The FacetedSearcher component enables the user to use faceted search on the current browsing state with 
 * the ThreeBrowser. It is used in LeftDock. 
 */
export default class FacetedSearcher extends React.Component<{
    onFiltersChanged : (filters:Filter[]) => void,
    className: string
}>{
    state = {
        tagsets: []
    }

    //The unique set of filters currently active:
    activeFilters : Set<Filter> = new Set();

    render(){
        return(
            <div id="FacetedSearcher" className={this.props.className}>
                <h4 className="Header">Faceted search</h4>
                <p>Toggle a checkbox to apply a filter:</p>
                <hr/>
                <div className="scrollable2">
                    {this.state.tagsets}
                </div>
            </div>
        );
    }

    componentDidMount(){
        this.renderTagsets()
    }

    /**
     * Fetches tagsets and tags from the server, and pressents them with a checkbox.
     * If the checkbox is checked or unchecked, this.onChange is called, and the filter
     * is added to activaFilters.
     */
    private async renderTagsets(){
        let renderedTagsets = await Fetcher.FetchTagsets()
            .then((tagsets:Tagset[]) => {
                return tagsets
                    .sort((ts1,ts2) => ts1.Name.localeCompare(ts2.Name))    //Sort each tagset
                    .map((ts:Tagset) => {                                   //Map each tagset to JSX element
                        return <div key={ts.Id}>
                            <p className="tagsetName">{ts.Name +":"}</p>
                            <br/>
                            {ts.Tags!
                            .sort((t1,t2) => t1.Name.localeCompare(t2.Name)) //Sort tags
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
                            )}
                        <hr/>
                        </div>;
                    });
            });
        this.setState({tagsets: renderedTagsets});
    }

    /**
     * Called when a toggle or untoggle happens.
     * @param e 
     */
    private onChange(e:React.ChangeEvent<HTMLInputElement>){
        if(e.target.checked){
            //Add filter
            this.activeFilters.add( { type: e.target.name, tagId: parseInt(e.target.value) } );
            //Notify parent component of change:
            this.props.onFiltersChanged(Array.from(this.activeFilters));
        }else{
            //Removing filter (activeFilters.remove() didn't work, this is a workaround):
            let newSet : Set<Filter> = new Set();
            this.activeFilters.forEach(f => {if(f.tagId != parseInt(e.target.value)) newSet.add(f)});
            this.activeFilters = newSet;
            //Notify parent component of change:
            this.props.onFiltersChanged(Array.from(this.activeFilters));
        }
    }
}