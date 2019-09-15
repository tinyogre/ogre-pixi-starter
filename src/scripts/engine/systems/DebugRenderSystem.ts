import {System} from "../System";
import { Point } from "pixi.js";
import { Entity } from "../entity";
import { DebugRenderComponent } from "../components/DebugRenderComponent";
import { Transform } from "../components/Transform";

export class DebugRenderSystem extends System {
    static sname = DebugRenderSystem.name;

    stage: PIXI.Container;

    constructor(stage: PIXI.Container) {
        super();
        this.stage = stage;
    }

    update(deltaTime: number): void {
        let es = this.engine.entityManager.getAll(DebugRenderComponent);
        for (let e of es) {
            let t = e.get(Transform);
            let drc = e.get(DebugRenderComponent);
            if (drc) {
                drc.g.position = t.pos;
            }
        }
    }

    addBox(e: Entity, ul: Point, size: Point, color: number) {
        let dc = e.getOrAdd(DebugRenderComponent);
        let g = dc.g;
        if (!g) {
            g = dc.g = new PIXI.Graphics();
        }
        g.lineStyle(1, color);
        g.drawRect(ul.x, ul.y, size.x, size.y);
        g.lineStyle(1, 0xff0000);
        g.drawRect(ul.x, ul.y, 1, 1);
        dc.addToStage(this.stage);
    }

    remove(e: Entity) {
        e.remove(DebugRenderComponent);
    }
}