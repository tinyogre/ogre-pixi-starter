import { EntityManager } from "../EntityManager";
import { SpriteComponent } from "../components/SpriteComponent";
import { Entity } from "../entity";
import { Transform } from "../components/Transform";
import { System } from "../System";

export class SpriteSystem extends System {
    static sname: string = SpriteSystem.name;
    constructor() { super(); }
    update(deltaTime: number) {
        let entities: Entity[] = EntityManager.instance.getAll(SpriteComponent);
        entities.forEach(e => {
            let s = e.get(SpriteComponent);
            s.sprite.position = e.get(Transform).pos;
        })
    }
}