
import {System} from "../engine/System";
import { SpriteComponent } from "../engine/components/SpriteComponent";
import { Transform } from "../engine/components/Transform";
import { Point, Rectangle } from "pixi.js";
import { PhysicsSystem } from "../engine/systems/PhysicsSystem";

export class PlayerSystem extends System {
    player: Entity;
    startGame() {
        let physics = this.engine.get(PhysicsSystem);
        this.player = this.engine.entityManager.createEntity();
        var sprite = this.player.add(SpriteComponent);
        var transform = this.player.add(Transform);
        transform.pos = new Point(160, 0);
        transform.rotation = 2;
        physics.addBox(this.player, new Rectangle(0,0,32,32));
        this.player.get(SpriteComponent).sprite = PIXI.Sprite.from('lander');
        this.engine.app.stage.addChild(this.player.get(SpriteComponent).sprite);
    }

    static sname: string = PlayerSystem.name;
    update(deltaTime: number): void {
    }
}