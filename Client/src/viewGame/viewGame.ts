/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
import * as PIXI from "pixi.js"
import {Square} from "../ObjectGame/SquareContainer";
import {Utils} from "../Utils";
import "gsap"
import Container = PIXI.Container;
import {Box} from "../ObjectGame/BoxContainer";
import Sprite = PIXI.Sprite;
import {Player} from "../ObjectGame/Player";
import * as IO from "socket.io-client";
export class viewGame {
    app = new PIXI.Application(1800, 1640, {backgroundColor: 0x1099bb});
    gametable = [1,5,5,5,5,5,1,5,5,5,5,5];
    field = new PIXI.Container();
    public broad_main;
    public broad;
    player;
    static turn = false;

    // static socket = IO.connect("localhost", {
    //     port: "3000"
    // });
    // player.Moveright(1);
    constructor() {
        // viewGame.socket.on('AddPlayer',this.addPlayer);
        this.createViewGame(this.player);
        // viewGame.socket.on('MoveRight',this.moveRight)
        // viewGame.socket.on('MoveLeft',this.moveLeft)

    }

    addPlayer = (data: any) => {
        this.player = new Player(data.team, '' + data.name);
    }
    moveRight = (data: any) => {
        this.broad.getChildAt(data).onMoveLeft(this.broad.getChildAt(data));
    }
    moveLeft = (data: any) => {
        this.broad.getChildAt(data).onMoveLeft(this.broad.getChildAt(data));
    }
    createViewGame(player1: Player) {
        document.body.appendChild(this.app.view);
        var background = PIXI.Sprite.fromImage('../Picture/background.jpg');
        background.width = this.app.renderer.width;
        background.height = this.app.renderer.height;
        background.width = 1200;
        background.height = 640;
        this.field.addChild(background);
        this.app.stage.addChild(this.field);
        this.field.scale.set(1.4);
        this.createBroad(this.gametable, player1)

    }
    createBroad(table, player1) {
        this.broad_main = new PIXI.Container();
        this.broad = new PIXI.Container();

        let container = new Container();
        let b;

        for (let i = 0; i < table.length; i++) {
            let square;
            let box;
            if (i == 0) {
                box = new Box(table[i]+9, 0);
                // box.height = 157;
                square = new Square(table[i], 1, 0);
                box.position.set(102, 73);
                square.position.set(102, 73);

            }
            else if (i == 6) {
                box = new Box(table[i]+9, 6);
                // box.height = 157;
                square = new Square(table[i], 2, 6);
                box.position.set(575, 73);
                square.position.set(575, 73)
            } else {
                if (i > 0 && i < 6)
                    square = new Square(table[i], 0, i, player1);
                else
                    square = new Square(table[i], 0, i);
                box = new Box(table[i]);
                let a = (112 + 77 * i) - Math.floor(i / 6) * ((112 + 77 * i) - 574 + (i - 6) * 77);
                let b = 150 - 77 * Math.floor(i / 6);
                box.position.set(a, b);
                square.position.set(a, b);
            }
            this.broad.addChild(square);
            container.addChild(box);

        }


        let home1 = new Square(0, 0, 12);
        home1.position.set(355, 318);
        let home2 = new Square(0, 0, 13);
        home2.position.set(355, -100);
        let spread = new Square(0, 0, 14);
        spread.position.set(10, 10);
        this.broad.addChild(home1, home2, spread);
        let h1 = new Box(0, 1);
        h1.position.set(300, 305);
        let h2 = new Box(0, 1);
        h2.position.set(300, -105);
        container.addChild(h1, h2);
        this.broad_main.addChild(this.broad);
        this.broad_main.addChild(container);
        this.broad_main.position.set(200, 158);
        this.field.addChild(this.broad_main);
        this.field.scale.set(0.7)
    }


}
