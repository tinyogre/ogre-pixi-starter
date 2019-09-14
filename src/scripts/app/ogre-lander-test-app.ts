import "pixi.js";
import {
    Dom,
    PixiAppWrapper,
    pixiAppWrapperEvent as WrapperEvent,
    PixiAppWrapperOptions as WrapperOpts,
} from "pixi-app-wrapper";
import { PixiAssetsLoader, Asset, AssetPriority, SoundAsset, LoadAsset } from "../third_party/pixi-assets-loader";
import { Sprite, Texture, SCALE_MODES, Point } from "pixi.js";
import { Entity } from "../engine/entity";
import { SpriteComponent } from "../engine/SpriteComponent";
import { Transform } from "../engine/Transform";

export class OgreLanderTestApp {
    app: PixiAppWrapper;
    loader: PixiAssetsLoader;

    assets: Asset[] = [
        {id: "lander", url: "assets/gfx/lander.png", priority: AssetPriority.HIGH, type: "texture"},
    ];
    sound: Howl;
    player: Entity;

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
        this.player = new Entity();
        var sprite = this.player.add(SpriteComponent);
        var transform = this.player.add(Transform);
        transform.pos = new Point(200, 200);
        this.app.ticker.add((dt) => this.moveMyHackyPlayer(dt));
    }
    //The `randomInt` helper function
    randomInt(min: number, max: number) : number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private moveMyHackyPlayer(deltaTime: number) {
        if (this.player) {
            var transform = this.player.get(Transform);
            transform.pos = new Point(this.randomInt(0, 320), this.randomInt(0, 240));
            var sc = this.player.get(SpriteComponent);
            if (sc.sprite) {
                sc.sprite.position = transform.pos;
            }
        }
    }

    private onAssetsLoaded(args: { priority: number, assets: LoadAsset[] }): void {
        window.console.log(`[SAMPLE APP] onAssetsLoaded ${args.assets.map(loadAsset => loadAsset.asset.id)}`);

        args.assets.forEach(loadAsset => {
            if (loadAsset.asset.id === "sound1" && loadAsset.loaded) {
                this.sound = (loadAsset.asset as SoundAsset).howl!;
            }
        });

        if (args.priority === AssetPriority.HIGH) {
            this.player.get(SpriteComponent).sprite = PIXI.Sprite.from('lander');
            this.app.stage.addChild(this.player.get(SpriteComponent).sprite);
        }
    }
}

