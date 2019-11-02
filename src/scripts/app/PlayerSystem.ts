import {System} from "../engine/System";
import { SpriteComponent } from "../engine/components/SpriteComponent";
import { Transform } from "../engine/components/Transform";
import { Point, Rectangle } from "pixi.js";
import { PhysicsSystem } from "../engine/systems/PhysicsSystem";
import { Entity } from "../engine/entity";
import { KeyboardSystem } from "../engine/systems/KeyboardSystem";
import {StandardGamepad, StandardGamepadMapping, StandardGamepadButton} from "../third_party/standard-gamepad";
import { OgrePixiApp } from "./ogre-pixi-app";
import { PlayerComponent } from "./PlayerComponent";
import { GameEvent } from "./GameEvent";
import { MessageSystem } from "./MessageSystem";

export class PlayerSystem extends System {
    static sname: string = "player";
    player?: Entity;
    playerComponent: PlayerComponent;
    keyboard: KeyboardSystem;
    messages: MessageSystem;
    physics: PhysicsSystem;

    mapping: StandardGamepadMapping = new StandardGamepadMapping();
    gamepad: StandardGamepad = new StandardGamepad(navigator, window, this.mapping);
    shotTimer: number = 0;

    startGame() {
        this.keyboard = this.engine.get(KeyboardSystem);
        this.engine.events.addListener(GameEvent.START_LEVEL, this.startLevel.bind(this));
        this.engine.events.addListener(GameEvent.END_LEVEL, this.endLevel.bind(this));

        this.keyboard.addKeyDown(this.keyDown.bind(this));

        this.gamepad.onConnected(() => { console.log("Gamepad connected!") });
        this.gamepad.enable();
        this.messages = this.engine.get(MessageSystem);
        this.physics = this.engine.get(PhysicsSystem);
    }

    startLevel() {
        this.spawnPlayer();
    }

    endLevel() {
        if (this.player) {
            this.engine.entityManager.deleteNow(this.player);
        }
        this.player = undefined;
    }

    spawnPlayer() {
        this.player = this.engine.entityManager.createEntity("player");
        let sprite = this.player.add(SpriteComponent);

        let transform = this.player.add(Transform);
        this.playerComponent = this.player.add(PlayerComponent);
        transform.pos = new Point(160, 0);
        transform.rotation = 0;
    }

    keyDown(key: number) {
        console.log(key);
        // ESC
        if (key == 27) {
            this.togglePause();
        }

    }
    update(deltaTime: number): void {
        if (!this.player) {
            return;
        }

        let t = this.player.get(Transform);
        let player = this.player.get(PlayerComponent);

        let buttons = this.gamepad.getPressedButtons();
        let joystick: any = this.gamepad.getJoystickPositions();
        let leftStick: Point = new Point(0,0);
        if (joystick && joystick.left) {
            leftStick = new Point(joystick.left.horizontal, joystick.left.vertical);
        }

        this.engine.gameStage.position = new Point(-t.pos.x + OgrePixiApp.CANVAS_SIZE.x / 2, -t.pos.y + OgrePixiApp.CANVAS_SIZE.y / 2);
    }

    pauseText: PIXI.Text;
    togglePause() {
        if (this.engine.paused) {
            this.engine.uiStage.removeChild(this.pauseText);
            this.engine.paused = false;
        } else {
            if (!this.pauseText) {
                this.pauseText = new PIXI.Text("ESC to Unpause, X to exit", { fontFamily: 'Press Start 2P', fontSize: 20, fill: 0xffaa77, align: 'center' });
                this.pauseText.position = new Point(320 - this.pauseText.width / 2, 235);
            }
            this.engine.uiStage.addChild(this.pauseText);
            this.engine.paused = true;
        }
    }
}