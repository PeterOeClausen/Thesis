import Axis from "./Axis";
import Position from "./Position";

export interface BrowsingState{
    xAxis: Axis;
    yAxis: Axis;
    zAxis: Axis;
    cameraPosition: Position;
    cameraAngle: any;
}