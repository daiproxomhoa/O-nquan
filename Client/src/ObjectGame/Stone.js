"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sprite = PIXI.Sprite;
const Utils_1 = require("../Utils");
/**
 * Created by Vu Tien Dai on 07/07/2017.
 */
class Stone extends Sprite {
    constructor(type) {
        super();
        this.type = type;
        this.createStone(this.type);
    }
    createStone(type) {
        let stone;
        if (type == 1) {
            stone = new PIXI.Sprite(Utils_1.Utils.Quan1);
            stone.scale.set(0.65);
            this.point = 10;
        }
        else if (type == 2) {
            stone = new PIXI.Sprite(Utils_1.Utils.Quan2);
            stone.scale.set(0.65);
            this.point = 10;
        }
        else {
            stone = new PIXI.Sprite(Utils_1.Utils.Stone1);
            stone.scale.set(0.75);
            this.point = 1;
        }
        this.addChild(stone);
    }
    get getType() {
        return this.type;
    }
    get getPoint() {
        return this.point;
    }
}
exports.Stone = Stone;
//# sourceMappingURL=Stone.js.map