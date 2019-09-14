
import {System} from "./System";
import { EntityManager } from "./EntityManager";

export class Engine {
    systems: System[] = [];
    public entityManager: EntityManager = new EntityManager();

    public update(deltaTime: number) {
        this.systems.forEach(s => s.update(deltaTime));
    }

    public add(s: System) {
        this.systems.push(s)
    }
}
