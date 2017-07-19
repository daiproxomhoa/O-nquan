"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Sprite = PIXI.Sprite;
var Utils_1 = require("../Utils");
/**
 * Created by Vu Tien Dai on 07/07/2017.
 */
var Stone = (function (_super) {
    __extends(Stone, _super);
    function Stone(type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.createStone(_this.type);
        return _this;
    }
    Stone.prototype.createStone = function (type) {
        var stone;
        if (type == 1) {
            stone = new PIXI.Sprite(Utils_1.Utils.Quan1);
            stone.scale.set(0.5);
            this.point = 10;
        }
        else if (type == 2) {
            stone = new PIXI.Sprite(Utils_1.Utils.Quan2);
            stone.scale.set(0.6);
            this.point = 10;
        }
        else {
            stone = new PIXI.Sprite(Utils_1.Utils.Stone1);
            stone.scale.set(0.08);
            this.point = 1;
        }
        this.addChild(stone);
    };
    Stone.prototype.getType = function () {
        return this.type;
    };
    Stone.prototype.getPoint = function () {
        return this.point;
    };
    return Stone;
}(Sprite));
exports.Stone = Stone;
//# sourceMappingURL=Stone.js.map