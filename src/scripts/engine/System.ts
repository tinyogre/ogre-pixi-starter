import { Engine } from "./Engine";

export abstract class System {
    sname: string;
    engine: Engine;
    abstract update(deltaTime: number): void;

}
