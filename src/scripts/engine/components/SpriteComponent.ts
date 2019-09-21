import {Component} from "../component"
import { Sprite, Point } from "pixi.js"

export class SpriteComponent extends Component {
    static cname = "sprite";
    public sprite: Sprite;
    public pivot: Point;
}
