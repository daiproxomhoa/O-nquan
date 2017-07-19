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
var Container = PIXI.Container;
var Utils_1 = require("../Utils");
/**
 * Created by Vu Tien Dai on 22/06/2017.
 */
var Box = (function (_super) {
    __extends(Box, _super);
    function Box(number, type) {
        var _this = _super.call(this) || this;
        _this.createBox(type);
        _this.createNumber(_this, number);
        if (type == 1)
            _this.text.position.set(20, 20);
        if (type == 0)
            _this.text.position.set(20, 80);
        if (type == 6)
            _this.text.position.set(63, 50);
        return _this;
    }
    Box.prototype.createBox = function (type) {
        var spirte;
        if (type == 0) {
            spirte = new PIXI.Sprite(Utils_1.Utils.Round1);
        }
        else if (type == 6) {
            spirte = new PIXI.Sprite(Utils_1.Utils.Round2);
        }
        else if (type == 1) {
            spirte = new PIXI.Sprite(Utils_1.Utils.Home);
        }
        else {
            spirte = new PIXI.Sprite(Utils_1.Utils.Square);
        }
        spirte.scale.set(0.5);
        this.addChild(spirte);
    };
    Box.prototype.createNumber = function (box, number) {
        var style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fontStyle: 'italic',
            fill: ['#BE3A11', '#FF902E'],
            stroke: '#000000',
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 2,
            wordWrap: true,
            wordWrapWidth: 440
        });
        this.text = new PIXI.Text('' + number, style);
        this.text.x = 55;
        this.text.y = 50;
        box.addChild(this.text);
    };
    Box.prototype.setText = function (text) {
        var style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fontStyle: 'italic',
            fill: ['#BE3A11', '#FF902E'],
            stroke: '#000000',
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 2,
            wordWrap: true,
            wordWrapWidth: 440
        });
        this.text.text = '' + text;
    };
    return Box;
}(Container));
exports.Box = Box;
//# sourceMappingURL=BoxContainer.js.map