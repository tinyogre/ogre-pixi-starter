import {b2World, b2Vec2, b2Body, b2BodyDef, b2PolygonShape, b2BodyType, XY} from "@flyover/box2d";
import {System} from "../System";
import { Transform } from "../components/Transform"
import { EntityManager } from "../EntityManager";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { DebugRenderSystem } from "./DebugRenderSystem";
import { Point, Rectangle } from "pixi.js";
import { Entity } from "../entity";

export class PhysicsSystem extends System {
    static sname = PhysicsSystem.name;
    world: b2World;
    ground: b2Body;
    debug: boolean;
    
    constructor() {
        super();
        let gravity: b2Vec2 = new b2Vec2(0, 5);
        this.world = new b2World(gravity);
    }

    update(deltaTime: number) {
        this.world.Step(deltaTime, 1, 1);
        let es = this.engine.entityManager.getAll(PhysicsComponent);
        for (let e of es) {
            var pc = e.get(PhysicsComponent);
            var t = e.get(Transform);
            let b2pos = pc.body.GetPosition();
            t.pos = new Point(b2pos.x, b2pos.y);
        }
    }

    private addBoxInternal(r: PIXI.Rectangle, type: b2BodyType, pc: PhysicsComponent, t: Transform) {
        let def = new b2BodyDef();
        def.type = type;
        def.position.Set(0, 0);
        pc.body = this.world.CreateBody(def);
        let box = new b2PolygonShape();
        let verts:XY[] = [
            {x: 0, y: 0},
            {x: 0, y: r.height},
            {x: r.width, y: r.height},
            {x: r.width, y: 0}
        ];
        box.Set(verts);
        pc.bounds = new PIXI.Rectangle(0, 0, r.width, r.height);
        pc.body.CreateFixture(box);
        pc.body.SetPosition(new b2Vec2(t.pos.x + r.x, t.pos.y + r.y));
    }

    createStatic(r: PIXI.Rectangle): Entity {
        let e = this.engine.entityManager.createEntity();
        let pc = e.add(PhysicsComponent);
        let t = e.add(Transform);
        t.pos = new Point(r.x, r.y);
        let rr = new PIXI.Rectangle(0, 0, r.width, r.height);
        this.addBoxInternal(rr, b2BodyType.b2_staticBody, pc, t);
        return e;
    }

    addBox(e: Entity, rect: PIXI.Rectangle) {
        let pc = e.getOrAdd(PhysicsComponent);
        let t = e.get(Transform);
        this.addBoxInternal(rect, b2BodyType.b2_dynamicBody, pc, t);
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
            let pc = e.get(PhysicsComponent);
            if (debug) {
                drs.addBox(e, new Point(pc.bounds.left, pc.bounds.top), 
                    new Point(pc.bounds.width, pc.bounds.height), 0xff00ff);
            } else {
                drs.remove(e);
            }
        }
    }
}