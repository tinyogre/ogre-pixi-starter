import { EntityManager } from "../EntityManager";
import { SpriteComponent } from "../components/SpriteComponent";
import { Entity } from "../entity";
import { Transform } from "../components/Transform";

export class SpriteSystem {
    constructor() {}
    update(deltaTime: number) {
        let entities: Entity[] = EntityManager.instance.getAll(SpriteComponent);
        entities.forEach(e => {
            let s = e.get(SpriteComponent);
            s.sprite.position = e.get(Transform).pos;
        })
    }
}