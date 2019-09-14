import { Point } from "pixi.js";
import { Component } from "./component";

export class Transform extends Component {
    static cname = Transform.name;
    pos: Point;
    rotation: number;
    scale: number;
}