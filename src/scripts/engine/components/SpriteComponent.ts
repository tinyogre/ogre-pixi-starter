import {Component} from "../component"
import { Sprite } from "pixi.js"

export class SpriteComponent extends Component {
    static cname = "sprite";
    public sprite: Sprite;
}
