
import {System} from "../engine/System";
import { SpriteComponent } from "../engine/components/SpriteComponent";
import { Transform } from "../engine/components/Transform";
import { Point, Rectangle } from "pixi.js";
import { PhysicsSystem } from "../engine/systems/PhysicsSystem";
import { Entity } from "../engine/entity";
import { PhysicsComponent } from "../engine/components/PhysicsComponent";
import { b2Vec2 } from "@flyover/box2d";
import { KeyboardSystem } from "../engine/KeyboardSystem";
import { Config } from "./config";

export class PlayerSystem extends System {
    static sname: string = PlayerSystem.name;
    player: Entity;
    keyboard: KeyboardSystem;

    startGame() {
        this.keyboard = this.engine.get(KeyboardSystem);
        let physics = this.engine.get(PhysicsSystem);
        this.player = this.engine.entityManager.createEntity();
        var sprite = this.player.add(SpriteComponent);
        var transform = this.player.add(Transform);
        transform.pos = new Point(160, 0);
        transform.rotation = 0;
        physics.addBox(this.player, new Rectangle(0,0,32,32));
        this.player.get(SpriteComponent).sprite = PIXI.Sprite.from('lander');
        this.engine.app.stage.addChild(this.player.get(SpriteComponent).sprite);
        
    }

    static rotate(v: b2Vec2, r: number): b2Vec2 {
        let out = new b2Vec2;
        return b2Vec2.RotateV(v, r, out);
    }

    update(deltaTime: number): void {
        if (this.keyboard.isKeyDown(87)) {
            let pc = this.player.get(PhysicsComponent);
            let t = this.player.get(Transform);
            pc.body.ApplyForce(PlayerSystem.rotate(new b2Vec2(0, -1000), t.rotation), pc.body.GetWorldCenter());
        }
    }
}