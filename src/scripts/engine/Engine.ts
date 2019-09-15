
import {System} from "./System";
import { EntityManager } from "./EntityManager";

export interface ISystemType<T extends System> {
    new(...args: any[]): T;
    sname: string;
}

export class Engine {
    systems: System[] = [];
    systemMap: Map<string, System> = new Map<string, System>();

    public entityManager: EntityManager = new EntityManager();

    public update(deltaTime: number) {
        this.systems.forEach(s => s.update(deltaTime));
    }

    public add<T extends System>(type: ISystemType<T>) : T {
        let s = new type();
        this.systems.push(s)
        this.systemMap.set(type.sname, s);
        s.engine = this;
        return <T>s;
    }

    public get<T extends System>(type: ISystemType<T>) : T {
        return <T>this.systemMap.get(type.sname);
    }
}
