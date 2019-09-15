import "pixi.js";
import {
    PixiAppWrapper,
    pixiAppWrapperEvent as WrapperEvent,
    PixiAppWrapperOptions as WrapperOpts,
} from "pixi-app-wrapper";
import { PixiAssetsLoader, Asset, AssetPriority, SoundAsset, LoadAsset } from "../third_party/pixi-assets-loader";
import { SCALE_MODES, Point, Rectangle } from "pixi.js";
import { Entity } from "../engine/entity";
import { SpriteComponent } from "../engine/components/SpriteComponent";
import { PhysicsSystem } from "../engine/systems/PhysicsSystem";
import { SpriteSystem } from "../engine/systems/SpriteSystem";
import { PlayerSystem } from "./PlayerSystem";
import { Engine } from "../engine/Engine";
import { DebugRenderSystem } from "../engine/systems/DebugRenderSystem";
import { PhysicsComponent } from "../engine/components/PhysicsComponent";

export class OgreLanderTestApp {
    app: PixiAppWrapper;
    loader: PixiAssetsLoader;

    assets: Asset[] = [
        {id: "lander", url: "assets/gfx/lander.png", priority: AssetPriority.HIGH, type: "texture"},
    ];
    sound: Howl;
    engine: Engine;
        
    constructor() {
        PIXI.settings.SCALE_MODE = SCALE_MODES.NEAREST;
        PIXI.settings.TARGET_FPMS = 60 / 1000;
        let type = "WebGL";
        if (!PIXI.utils.isWebGLSupported()) {
            type = "canvas";
        }
        PIXI.utils.sayHello(type);

        this.app = new PixiAppWrapper({width: 320, height: 240, resolution: 4});
        this.app.renderer.backgroundColor = 0x000040;
        this.loader = new PixiAssetsLoader();
        this.loader.on(PixiAssetsLoader.PRIORITY_GROUP_LOADED, this.onAssetsLoaded.bind(this));
        this.loader.addAssets(this.assets).load();

        this.engine = new Engine(this.app);
        
        this.engine.add(PhysicsSystem);
        this.engine.add(SpriteSystem);
        this.engine.add(PlayerSystem);
        let debugRenderSystem = this.engine.add(DebugRenderSystem);
        debugRenderSystem.stage = this.app.stage;
    }

    private startGame() {
        let physics = this.engine.get(PhysicsSystem);
        physics.createStatic(new PIXI.Rectangle(0, 230, 320, 10));

        this.engine.get(PlayerSystem).startGame();
        this.app.ticker.add((dt) => this.update(dt));

        let p = this.engine.get(PhysicsSystem);
        if (p) {
            p.setDebug(true);
        }
    }

    //The `randomInt` helper function
    randomInt(min: number, max: number) : number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private update(deltaLunacy: number) {
        // Pixi.js's "delta time" was created by a lunatic.  Convert it into
        // a saner seconds passed deltaTime.
        let deltaTime = (deltaLunacy / PIXI.settings.TARGET_FPMS) / 1000;
        this.engine.update(deltaTime);
    }

    private onAssetsLoaded(args: { priority: number, assets: LoadAsset[] }): void {
        window.console.log(`[SAMPLE APP] onAssetsLoaded ${args.assets.map(loadAsset => loadAsset.asset.id)}`);

        args.assets.forEach(loadAsset => {
            if (loadAsset.asset.id === "sound1" && loadAsset.loaded) {
                this.sound = (loadAsset.asset as SoundAsset).howl!;
            }
        });

        if (args.priority === AssetPriority.HIGH) {
            this.startGame();
        }
    }
}

