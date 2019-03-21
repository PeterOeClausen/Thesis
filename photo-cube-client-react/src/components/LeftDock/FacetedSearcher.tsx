import React from 'react';
import Fetcher from '../Middle/ThreeBrowser/Fetcher';
import Tagset from '../Middle/ThreeBrowser/Tagset';
import '../../css/FacetedSearcher.css';

export interface Filter{
    type: string,
    tagId: number
}

export default class FacetedSearcher extends React.Component<{
    onFiltersChanged : (filters:Filter[]) => void,
    className: string
}>{
    state = {
        tagsets: []
    }

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

    private async renderTagsets(){
        let renderedTagsets = await Fetcher.FetchTagsets()
            .then((tagsets:Tagset[]) => {
                return tagsets
                    .sort((ts1,ts2) => ts1.Name.localeCompare(ts2.Name))    //Sort each tagset
                    .map((ts:Tagset) => {                                   //Map each tagset to JSX element
                        return <div key={ts.Id}>
                            <p className="tagsetName">{ts.Name +":"}</p><br/>
                            {ts.Tags!
                            .sort((t1,t2) => t1.Name.localeCompare(t2.Name))
                            .map(t => 
                            <div className="tagName" key={t.Id}><p>{t.Name}<input 
                                type="checkbox"
                                name={"tag"}
                                value={t.Id}
                                onChange={e => this.onChange(e)}
                                ></input>
                                </p><br/></div>
                            )}
                        <hr/>
                        </div>;
                    });
            });
        this.setState({tagsets: renderedTagsets});
    }

    private onChange(e:React.ChangeEvent<HTMLInputElement>){
        console.log(e);
        if(e.target.checked){
            //Add filter
            console.log(e.target.value);
            console.log("Checked!");
            this.activeFilters.add( { type: e.target.name, tagId: parseInt(e.target.value) } );
            console.log(Array.from(this.activeFilters));
            this.props.onFiltersChanged(Array.from(this.activeFilters));
        }else{
            //Add filter
            console.log(e.target.value);
            console.log("Unchecked!");
            //activeFilters.delete didn't work, so this is a workaround:
            let newSet : Set<Filter> = new Set();
            this.activeFilters.forEach(f => {if(f.tagId != parseInt(e.target.value)) newSet.add(f)});
            this.activeFilters = newSet;
            console.log(Array.from(this.activeFilters));
            this.props.onFiltersChanged(Array.from(this.activeFilters));
        }
    }
}