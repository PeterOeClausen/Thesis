import React from 'react';
import Fetcher from '../Middle/ThreeBrowser/Fetcher';
import Hierarchy from '../Middle/ThreeBrowser/Hierarchy';
import HierarchyNode from '../Middle/ThreeBrowser/HierarchyNode';
import '../../css/HierarchyBrowser.css';
import PickedDimension from './PickedDimension';

/**
 * The hierarchy browser component enables the user to browse hierarchies.
 */
export default class HierarchyBrowser extends React.Component<{
        onDimensionChanged: (dimName: string, dimension:any) => void,
        className: string
    }>{
    state = {
        xIsHieararchy: false,
        yIsHieararchy: false,
        zIsHieararchy: false,
        xNodes: <p>No xNodes</p>,
        yNodes: <p>No yNodes</p>,
        zNodes: <p>No zNodes</p>
    }
    
    render(){
        let message = !this.state.xIsHieararchy && !this.state.yIsHieararchy && !this.state.zIsHieararchy ? <p>Pick a hierarchy to browse...</p> : <div></div>;
        let xContainer = this.state.xIsHieararchy ? <div><p>x-hierarchy:</p><div className="scrollable">{this.state.xNodes}</div></div> : <div></div>
        let yContainer = this.state.yIsHieararchy ? <div><p>y-hierarchy:</p><div className="scrollable">{this.state.yNodes}</div></div> : <div></div>
        let zContainer = this.state.zIsHieararchy ? <div><p>z-hierarchy:</p><div className="scrollable">{this.state.zNodes}</div></div> : <div></div>
        return(
            <div id="HierarchyBrowser" className={this.props.className}>
                <h4 className="Header">HierarchyBrowser:</h4>
                <div className="hierarchyContainer">
                    {message}
                    {xContainer}
                    {yContainer}
                    {zContainer}
                </div>
            </div>
        )
    }

    /**
     * Given a dimName ("X", "Y" or "Z") and a PickedDimension renders the HierarchyBrowser.
     * @param dimName 
     * @param dimension 
     */
    async RenderHierarchy(dimName: string, dimension:PickedDimension){
        console.log("Render Hierarchy");
        let hierarchy : Hierarchy = await Fetcher.FetchHierarchy(dimension.id);
        let rootNode: HierarchyNode = await Fetcher.FetchNode(hierarchy.RootNodeId);
        switch(dimName){
            case "X":
                this.setState({xIsHieararchy:true, xNodes: this.renderNode(dimName, rootNode, 0)});
                break;
            case "Y":
                this.setState({yIsHieararchy:true, yNodes: this.renderNode(dimName, rootNode, 0)});
                break;
            case "Z":
                this.setState({zIsHieararchy:true, zNodes: this.renderNode(dimName, rootNode, 0)});
                break;
        }
        
        console.log(hierarchy);       
    }

    /**
     * Helper method to recursively render buttons repressenting a nodes in a hierarchy.
     * @param dimName "X" "Y" or "Z".
     * @param node call with root node in a hierarchy.
     * @param level call with level 0.
     */
    private renderNode(dimName: string, node: HierarchyNode, level: number){
        let nodeLevelClassName : string = "nodeLevel-"+level;
        let result = 
            <div key={"Node:" + node.Tag.Id + ", level: " + level}>
                <button
                    className={nodeLevelClassName} 
                    onClick={ () => this.props.onDimensionChanged(dimName, {type:"hierarchyNode", id:node.Id, name:node.Tag.Name})}>
                        {node.Tag.Name}
                </button> 
                { node.Children.map(n => this.renderNode(dimName, n, level + 1)) }
            </div>
        return result;
    }

    /**
     * To clear a hierarchy from outside of class. Called by super components.
     * @param dimName "X", "Y" or "Z".
     */
    ClearHierarchy(dimName: string){        
        switch(dimName){
            case "X":
                this.setState({xIsHieararchy: false, xNodes: <p>No xNodes</p>});
                break;
            case "Y":
                this.setState({yIsHieararchy: false, yNodes: <p>No yNodes</p>});
                break;
            case "Z":
                this.setState({zIsHieararchy: false, zNodes: <p>No zNodes</p>});
                break;
        }
    }
}