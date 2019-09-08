import "pixi.js";
import {
    Dom,
    PixiAppWrapper,
    pixiAppWrapperEvent as WrapperEvent,
    PixiAppWrapperOptions as WrapperOpts,
} from "pixi-app-wrapper";

export class OgreStarterApp {
    app: PixiAppWrapper;

    constructor() {
        let type = "WebGL";
        if (!PIXI.utils.isWebGLSupported()) {
            type = "canvas";
        }
        PIXI.utils.sayHello(type);

        this.app = new PixiAppWrapper({width: 320, height: 240, resolution: 4});
        this.app.renderer.backgroundColor = 0x000040;
    }
}

