import EventEmitter = require("eventemitter3");
import "fpsmeter";
import {Dom, pixiAppWrapperEvent} from "./index";
import * as PIXI from "pixi.js";
window.PIXI = PIXI;
import "pixi-layers";
import {MediaInfoData, MediaInfoViewer} from "./info/media-info-viewer";
import {AlignBottomCenter} from "./stage/align/align-bottom-center";
import {AlignBottomLeft} from "./stage/align/align-bottom-left";
import {AlignBottomRight} from "./stage/align/align-bottom-right";
import {AlignMiddle} from "./stage/align/align-middle";
import {AlignMiddleLeft} from "./stage/align/align-middle-left";
import {AlignMiddleRight} from "./stage/align/align-middle-right";
import {AlignStrategy} from "./stage/align/align-strategy";
import {AlignTopCenter} from "./stage/align/align-top-center";
import {AlignTopLeft} from "./stage/align/align-top-left";
import {AlignTopRight} from "./stage/align/align-top-right";
import {ScaleFullSize} from "./stage/scale/scale-full-size";
import {ScaleKeepAspectRatio} from "./stage/scale/scale-keep-aspect-ratio";
import {ScaleNone} from "./stage/scale/scale-none";
import {ScaleStrategy} from "./stage/scale/scale-strategy";

export interface PixiAppWrapperOptions {
    width: number;
    height: number;
    align?: "top-left" | "top-center" | "top-right" | "middle-left" | "middle" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right";
    scale?: "none" | "keep-aspect-ratio" | "full-size";
    changeOrientation?: boolean;
    showFPS?: boolean;
    showMediaInfo?: boolean;
    view?: HTMLCanvasElement;
    resolution?: number;
}

/**
 * Wrapper for PIXI.Application class enabling features like scaling, aligning, fps-meter and a media info viewer.
 */
export class PixiAppWrapper extends EventEmitter {

    private readonly defaultScaleMethod = "none";
    private readonly defaultAlignMethod = "top-left";

    private readonly defaultOptions: PixiAppWrapperOptions = {
        width: 800,
        height: 600,
        scale: this.defaultScaleMethod,
        align: this.defaultAlignMethod,
        showFPS: false,
        showMediaInfo: false,
    };

    private readonly fpsmeterOptions: FPSMeterOptions = {
        theme: "transparent",
        heat: 1,
        graph: 1,
        history: 20,
        zIndex: 100,
    };

    private app: PIXI.Application;
    private appOptions: PixiAppWrapperOptions;

    private width: number;
    private height: number;
    private landscape: boolean;

    private alignStrategy: AlignStrategy;
    private scaleStrategy: ScaleStrategy;

    private fpsmeter: FPSMeter;
    private mediaInfoViewer: MediaInfoViewer;

    private resizing: boolean;

    constructor(options?: PixiAppWrapperOptions) {
        super();

        if (!options) {
            options = this.defaultOptions;
        }

        this.resizing = false;

        this.mediaInfoViewer = new MediaInfoViewer();

        this.app = new PIXI.Application(options);
        document.body.appendChild(this.app.view);
        this.app.stage = new PIXI.display.Stage();
        //this.app.stage = new PIXI.display.Stage();

        this.configure(options);
        this.ticker.add(this.resize.bind(this));

        this.appOptions = options;
    }

    get initialHeight(): number {
        return this.height;
    }

    get initialWidth(): number {
        return this.width;
    }

    get stage(): PIXI.Container {
        return this.app.stage;
    }

    get ticker(): PIXI.Ticker {
        return this.app.ticker;
    }

    get renderer(): PIXI.Renderer {
        return this.app.renderer;
    }

    get screen(): PIXI.Rectangle {
        return this.app.screen;
    }

    get view(): HTMLCanvasElement {
        return this.app.view;
    }

    /**
     * Returns media info from the application.
     * @returns {MediaInfoData} Media info
     */
    public getMediaInfo(): MediaInfoData {
        return {
            display: {
                screen: {
                    width: this.screen.width,
                    height: this.screen.height,
                },
                view: {
                    width: this.view.clientWidth,
                    height: this.view.clientHeight,
                },
                stage: {
                    x: this.stage.x,
                    y: this.stage.y,
                    initialWidth: this.initialWidth,
                    initialHeight: this.initialHeight,
                    currentWidth: Math.ceil(this.initialWidth * this.stage.scale.x),
                    currentHeight: Math.ceil(this.initialHeight * this.stage.scale.y),
                    scaleX: this.stage.scale.x.toFixed(2),
                    scaleY: this.stage.scale.y.toFixed(2),
                    scaling: this.appOptions.scale ? this.appOptions.scale.valueOf() : this.defaultScaleMethod,
                    alignment: this.appOptions.align ? this.appOptions.align.valueOf() : this.defaultAlignMethod,
                    orientation: this.landscape ? "landscape" : "portrait",
                },
            },
        };
    }

    private configure(options: PixiAppWrapperOptions): void {
        this.width = options.width;
        this.height = options.height;
        this.landscape = (this.width >= this.height);

        switch (options.align) {
            case "top-center":
                this.alignStrategy = new AlignTopCenter();
                break;

            case "top-right":
                this.alignStrategy = new AlignTopRight();
                break;

            case "middle-left":
                this.alignStrategy = new AlignMiddleLeft();
                break;

            case "middle":
                this.alignStrategy = new AlignMiddle();
                break;

            case "middle-right":
                this.alignStrategy = new AlignMiddleRight();
                break;

            case "bottom-left":
                this.alignStrategy = new AlignBottomLeft();
                break;

            case "bottom-center":
                this.alignStrategy = new AlignBottomCenter();
                break;

            case "bottom-right":
                this.alignStrategy = new AlignBottomRight();
                break;

            default:
                this.alignStrategy = new AlignTopLeft();
                break;
        }

        switch (options.scale) {
            case "keep-aspect-ratio":
                this.scaleStrategy = new ScaleKeepAspectRatio();
                break;

            case "full-size":
                this.scaleStrategy = new ScaleFullSize();
                break;

            default:
                this.scaleStrategy = new ScaleNone();
                break;
        }

        if (options.showFPS) {
            this.createFPSmeter();
        }

        if (!options.showMediaInfo) {
            this.mediaInfoViewer.hide();
        }

        if (!options.view) {
            document.body.appendChild(this.app.view); // If no canvas specified, add it to html body
        }
    }

    private createFPSmeter(): void {
        this.fpsmeter = new FPSMeter(Dom.getElementOrBody("fps-meter"), this.fpsmeterOptions);
        this.ticker.add(this.fpsmeter.tick);
        this.fpsmeter.show();
    }

    private resize(): void {
        const multiplier = PIXI.settings.RESOLUTION || 1;
        const width = Math.floor(this.view.clientWidth * multiplier);
        const height = Math.floor(this.view.clientHeight * multiplier);

        if (!this.resizing && (this.view.width !== width || this.view.height !== height)) {
            this.resizing = true;

            // dispatch resize start event
            this.emit(pixiAppWrapperEvent.RESIZE_START);

            // resize
            this.app.resize();
            //this.renderer.resize(this.view.clientWidth, this.view.clientHeight);

            // check orientation
            const orientationChanged = this.orientate();

            // scale
            this.scale();

            // align
            this.align();

            // update media info
            this.mediaInfoViewer.update(this.getMediaInfo());

            this.resizing = false;

            // dispatch resize end event
            this.emit(pixiAppWrapperEvent.RESIZE_END, {
                stage: {
                    position: {
                        x: this.stage.position.x,
                        y: this.stage.position.y,
                    },
                    scale: {
                        x: this.stage.scale.x,
                        y: this.stage.scale.y,
                    },
                    size: {
                        width: this.initialWidth * this.stage.scale.x,
                        height: this.initialHeight * this.stage.scale.y,
                    },
                    orientation: {
                        landscape: this.landscape,
                        changed: orientationChanged,
                    },
                },
                view: {
                    width: this.view.width,
                    height: this.view.height,
                },
            });
        }
    }

    private orientate(): boolean {
        let changed = false;

        if (this.appOptions.changeOrientation) {
            if (this.landscape && this.view.clientHeight > this.view.clientWidth) {
                // change to portrait mode
                changed = true;
                this.landscape = false;
                this.swapSize();

            } else if (!this.landscape && this.view.clientWidth > this.view.clientHeight) {
                changed = true;
                this.landscape = true;
                this.swapSize();
            }
        }

        return changed;
    }

    private swapSize(): void {
        const tempW = this.width;
        this.width = this.height;
        this.height = tempW;
    }

    private scale(): void {
        const {scaleX, scaleY} = this.scaleStrategy.scale(this.initialWidth, this.initialHeight, this.view.clientWidth, this.view.clientHeight);
        this.stage.scale.set(scaleX, scaleY);
    }

    private align(): void {
        const {x, y} = this.alignStrategy.align(this.initialWidth * this.stage.scale.x, this.initialHeight * this.stage.scale.y, this.view.clientWidth, this.view.clientHeight);
        this.stage.position.set(x, y);
    }
}
