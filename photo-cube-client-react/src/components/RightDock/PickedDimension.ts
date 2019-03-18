/**
 * Interface for objects repressenting a picked dimension. Used in BrowsingState.ts.
 * Also used to repressent a dimension picked in the interface to be passed around when onBrowsingModeChanged happens.
 */
export default interface PickedDimension{
    type:string,
    id:number, 
    name:string
}