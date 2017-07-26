import Sprite = PIXI.Sprite;
import {Utils} from "../Utils";
/**
 * Created by Vu Tien Dai on 07/07/2017.
 */
export class Stone extends Sprite {
    type;
    point;
    constructor(type:number) {
        super();
        this.type = type;
        this.createStone(this.type);
    }

    createStone(type) {
        let stone;
        if (type == 1) {
            stone = new PIXI.Sprite(Utils.Quan1);
            stone.scale.set(0.65);
            this.point = 10;
        }
        else if (type == 2) {
            stone = new PIXI.Sprite(Utils.Quan2);
            stone.scale.set(0.65);
            this.point = 10;
        }
        else {
            stone = new PIXI.Sprite(Utils.Stone1);
            stone.scale.set(0.75);
            this.point = 1;
        }
        this.addChild(stone);
    }

    get getType(): number {
        return this.type;
    }
    get getPoint(): number {
        return this.point;
    }
}