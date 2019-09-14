import {b2World, b2Vec2, b2Body, b2BodyDef, b2PolygonShape} from "@flyover/box2d";
import {System} from "../System";
import { EntityManager } from "../EntityManager";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { DebugRenderSystem } from "./DebugRenderSystem";
import { Point } from "pixi.js";
import { Entity } from "../entity";

export class PhysicsSystem extends System {
    static sname = PhysicsSystem.name;
    world: b2World;
    ground: b2Body;
    debug: boolean;
    
    constructor() {
        super();
        let gravity: b2Vec2 = new b2Vec2(0, -5);
        this.world = new b2World(gravity);
        let groundDef: b2BodyDef = new b2BodyDef();
        groundDef.position.Set(0, -10);
        this.ground = this.world.CreateBody(groundDef);
        let groundBox: b2PolygonShape = new b2PolygonShape();
        groundBox.SetAsBox(50, 10);
        this.ground.CreateFixture(groundBox, 0);
    }

    update(deltaTime: number) {
    }

    setDebug(debug: boolean) {
        if (debug === this.debug) {
            return;
        }
        var comps = EntityManager.instance.getAll(PhysicsComponent);
        let drs = this.engine.get(DebugRenderSystem);
        if (drs == null) {
            return;
        }
        for (let e of comps) {
            if (debug) {
                drs.addBox(e, new Point(0,0), new Point(10, 10), 0xff0000);
            } else {
                drs.remove(e);
            }
        }
    }
}