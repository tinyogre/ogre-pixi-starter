import "pixi.js";
import {
    PixiAppWrapper,
    pixiAppWrapperEvent as WrapperEvent,
    PixiAppWrapperOptions as WrapperOpts,
} from "pixi-app-wrapper";
import { PixiAssetsLoader, Asset, AssetPriority, SoundAsset, LoadAsset } from "../third_party/pixi-assets-loader";
import { SCALE_MODES, Point } from "pixi.js";
import { Entity } from "../engine/entity";
import { SpriteComponent } from "../engine/components/SpriteComponent";
import { Transform as TransformComponent } from "../engine/components/Transform";
import { PhysicsSystem } from "../engine/systems/PhysicsSystem";
import { SpriteSystem } from "../engine/systems/SpriteSystem";
import { PlayerSystem } from "./PlayerSystem";
import { Engine } from "../engine/Engine";

export class OgreLanderTestApp {
    app: PixiAppWrapper;
    loader: PixiAssetsLoader;

    assets: Asset[] = [
        {id: "lander", url: "assets/gfx/lander.png", priority: AssetPriority.HIGH, type: "texture"},
    ];
    sound: Howl;
    player: Entity;
    engine: Engine;
        
    constructor() {
        PIXI.settings.SCALE_MODE = SCALE_MODES.NEAREST;
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

        this.engine = new Engine();
        
        this.engine.add(new PhysicsSystem());
        this.engine.add(new SpriteSystem());
        this.engine.add(new PlayerSystem());
    }

    private startGame() {
        this.player = this.engine.entityManager.createEntity();
        var sprite = this.player.add(SpriteComponent);
        var transform = this.player.add(TransformComponent);
        
        transform.pos = new Point(160, 0);
        this.player.get(SpriteComponent).sprite = PIXI.Sprite.from('lander');
        this.app.stage.addChild(this.player.get(SpriteComponent).sprite);
    
        this.app.ticker.add((dt) => this.update(dt));
    }

    //The `randomInt` helper function
    randomInt(min: number, max: number) : number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private update(deltaTime: number) {
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

