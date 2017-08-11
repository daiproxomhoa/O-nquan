///<reference path="../Utils.ts"/>
import {Utils} from "../Utils";
import Container = PIXI.Container;
import {viewGame} from "../viewGame/viewGame";
/**
 * Created by Vu Tien Dai on 25/07/2017.
 */
export class clock extends Container {
    private _number;
    time;
    timedisplay =15;
    timecount = 0;
    i;
    countdown;
    style = new PIXI.TextStyle({
        fontFamily: 'Cooper Black',
        fontSize: 90,
        fontStyle: 'italic',
        fill: ['#8F755C', '#8F755C'], // gradient
        stroke: '#000000',
        strokeThickness: 2
    });

    constructor() {
        super();
        let watch = new PIXI.Sprite(Utils.Clock);
        this.time = new PIXI.Text("" + this.timedisplay + " ", this.style);
        this.time.position.set(70, 100);
        this.addChild(this.time, watch)
        this.scale.set(0.7);
    }

    public setTime(number: number) {
        this._number = number;
        if (number > 9)
            this.time.text = "" + number + " ";
        else
            this.time.text = "0" + number + " ";
    }

    run = () => {
        this.countdown = setInterval(() => {
            if (this.timedisplay - this.timecount > -1) {
                this.setTime(this.timedisplay - this.timecount);
                this.timecount++;
            }
            else {
                if(viewGame.turn==viewGame.game_turn)
                viewGame.player.emit("End turn");
                clearTimeout(this.countdown);
            }

        }, 1000);
    }
    restart = () => {
        clearTimeout(this.countdown);
        this.timecount = 0;
        this.run();
    }
    stop = () => {
        clearTimeout(this.countdown);
    }

    getTime(): number {
        return this.time;
    }

    setTimeDisplay(value: number) {
        this.timedisplay = value;
    }
}