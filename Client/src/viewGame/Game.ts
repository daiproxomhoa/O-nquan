import * as PIXI from "pixi.js"
import {Square} from "../ObjectGame/SquareContainer";
import * as gsap from "gsap"
import Container = PIXI.Container;
import {Box} from "../ObjectGame/BoxContainer";
import Sprite = PIXI.Sprite;
import {Utils} from "../Utils";
import {clock} from  "../ObjectGame/Clock";
import TweenMax = gsap.TweenMax;
export class Game extends Container {
    // gametable = [7 , 0, 0, 1, 0, 0, 7, 0, 0, 1, 0, 0, 7, 7];
    private gametable = [1, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5, 0, 0];
    private broad_main;
    broad;
    flag;
    clock;
    public static clock;
    private FinishGame = false;

    constructor() {
        super();
        this.createBroadGame();
        this.createClock();
        this.createFlag();
    }

    createFlag = () => {
        this.flag = new PIXI.Sprite(Utils.Flag);
        this.flag.scale.set(0.65);
        this.addChild(this.flag);
    }
    createClock = () => {
        this.clock = new clock();
        this.clock.position.set(70, 205);
        this.addChild(this.clock);
    }
    reloadGame=()=>{
        this.clock.stop();
        this.removeChildren();
        this.createBroadGame();
        this.createFlag();
        this.createClock();
    }
    createBroadGame=()=> {
        var background = PIXI.Sprite.fromImage('../Picture/background.png');
        background.width = 1200;
        background.height = 640;
        this.addChild(background);
        this.createBroad(this.gametable);

    }

    createBroad(table) {
        this.broad_main = new PIXI.Container();
        this.broad = new PIXI.Container();

        let container = new Container();
        let b;

        for (let i = 0; i < table.length - 2; i++) {
            let square;
            let box;
            if (i == 0) {
                box = new Box(table[i] + 9, 0);
                // box.height = 157;
                square = new Square(table[i], 1, 0, this);
                box.position.set(102, 73);
                square.position.set(102, 73);

            }
            else if (i == 6) {
                box = new Box(table[i] + 9, 6);
                // box.height = 157;
                square = new Square(table[i], 2, 6, this);
                box.position.set(575, 73);
                square.position.set(575, 73)
            } else {
                if (i > 0 && i < 6)
                    square = new Square(table[i], 0, i, this);
                else
                    square = new Square(table[i], 0, i, this);
                box = new Box(table[i]);
                let a = (112 + 77 * i) - Math.floor(i / 6) * ((112 + 77 * i) - 574 + (i - 6) * 77);
                let b = 150 - 77 * Math.floor(i / 6);
                box.position.set(a, b);
                square.position.set(a, b);
            }
            square.setPos(square.x, square.y);
            this.broad.addChild(square);
            container.addChild(box);

        }
        let home1 = new Square(table[12], 0, 12, this);
        home1.position.set(355, 318);
        home1.setPos(home1.x, home1.y);
        let home2 = new Square(table[13], 0, 13, this);
        home2.position.set(355, -100);
        home2.setPos(home1.x, home1.y);
        let spread = new Square(0, 0, 14, this);
        spread.position.set(10, 10);
        spread.setPos(10, 10);
        this.broad.addChild(home1, home2, spread);
        let h1 = new Box(0, 1);
        h1.position.set(300, 305);
        let h2 = new Box(0, 1);
        h2.position.set(300, -105);
        container.addChild(h1, h2);
        this.broad_main.addChild(this.broad);
        this.broad_main.addChild(container);
        this.broad_main.position.set(200, 158);
        this.addChild(this.broad_main);
    }
}
