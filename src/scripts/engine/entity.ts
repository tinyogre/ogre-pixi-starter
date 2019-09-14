import {Component} from "./component";

interface IConstructor<T extends Component> {
    new(...args: any[]): T;
    cname: string;
}

export class Entity {
    public get<T extends Component>(type: IConstructor<T>) : T {
        return <T>this.components.get(type.cname)
    }
    components: Map<string, Component> = new Map<string, Component>();
    constructor() {}

    public add<T extends Component>(type: IConstructor<T>) : T {
        let c: Component = new type();
        this.components.set(type.cname, c);
        c.entity = this;
        return <T>c;
    }

}