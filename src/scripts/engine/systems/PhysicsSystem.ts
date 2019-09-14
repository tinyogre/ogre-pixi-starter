import {b2World, b2Vec2, b2Body, b2BodyDef, b2PolygonShape, b2BodyType} from "@flyover/box2d";
import {System} from "../System";
import { Transform } from "../components/Transform"
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
        let gravity: b2Vec2 = new b2Vec2(0, 5);
        this.world = new b2World(gravity);
        let groundDef: b2BodyDef = new b2BodyDef();
        groundDef.position.Set(0, -10);
        this.ground = this.world.CreateBody(groundDef);
        let groundBox: b2PolygonShape = new b2PolygonShape();
        groundBox.SetAsBox(320, 10);
        this.ground.SetPosition(new b2Vec2(0, 240));
        this.ground.CreateFixture(groundBox, 0);
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

    addBox(e: Entity, rect: PIXI.Rectangle) {
        let pc = e.getOrAdd(PhysicsComponent);
        let def: b2BodyDef = new b2BodyDef();
        def.type = b2BodyType.b2_dynamicBody;
        def.position.Set(0,0);
        let body = this.world.CreateBody(def);
        let box = new b2PolygonShape();
        box.SetAsBox(rect.width, rect.height);
        pc.bounds = rect;
        body.CreateFixture(box);
        pc.body = body;
        let t = e.get(Transform);
        pc.body.SetPosition(new b2Vec2(t.pos.x + rect.x, t.pos.y + rect.y));
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