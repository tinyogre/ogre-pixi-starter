import "pixi.js";

export class OgreStarterApp {
    constructor() {
        let type = "WebGL";
        if (!PIXI.utils.isWebGLSupported()) {
            type = "canvas";
        }
        PIXI.utils.sayHello(type);
    }
}

