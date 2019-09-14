import {Entity, IComponentType} from "./entity";
import { Component } from "./component";

export class EntityManager {
    public static instance: EntityManager;
    entities: Map<number, Entity> = new Map<number, Entity>();
    nextId: number = 1;

    constructor() {
        EntityManager.instance = this;
    }

    public createEntity(): Entity{
        let e: Entity = new Entity();
        e.id = this.nextId++;
        this.entities.set(e.id, e);
        return e;
    }

    public getEntity(id: number): Entity {
        return <Entity>this.entities.get(id);
    }
    getAll<T extends Component>(type: IComponentType<T>): Entity[] {
        let r: Entity[] = [];
        this.entities.forEach(e => r.push(e));
        return r;
    }
}