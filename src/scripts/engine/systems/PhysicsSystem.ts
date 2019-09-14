import {b2World, b2Vec2, b2Body, b2BodyDef, b2PolygonShape} from "@flyover/box2d";

export class PhysicsSystem {
    update(deltaTime: number) {
    }
    world: b2World;
    ground: b2Body;

    constructor() {
        let gravity: b2Vec2 = new b2Vec2(0, -5);
        this.world = new b2World(gravity);
        let groundDef: b2BodyDef = new b2BodyDef();
        groundDef.position.Set(0, -10);
        this.ground = this.world.CreateBody(groundDef);
        let groundBox: b2PolygonShape = new b2PolygonShape();
        groundBox.SetAsBox(50, 10);
        this.ground.CreateFixture(groundBox, 0);

    }
}