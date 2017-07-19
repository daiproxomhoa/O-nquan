"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
var PIXI = require("pixi.js");
var SquareContainer_1 = require("../ObjectGame/SquareContainer");
require("gsap");
var Container = PIXI.Container;
var BoxContainer_1 = require("../ObjectGame/BoxContainer");
var Player_1 = require("../ObjectGame/Player");
var viewGame = (function () {
    // static socket = IO.connect("localhost", {
    //     port: "3000"
    // });
    // player.Moveright(1);
    function viewGame() {
        var _this = this;
        this.app = new PIXI.Application(1800, 1640, { backgroundColor: 0x1099bb });
        this.gametable = [1, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5];
        this.field = new PIXI.Container();
        this.addPlayer = function (data) {
            _this.player = new Player_1.Player(data.team, '' + data.name);
        };
        this.moveRight = function (data) {
            _this.broad.getChildAt(data).onMoveLeft(_this.broad.getChildAt(data));
        };
        this.moveLeft = function (data) {
            _this.broad.getChildAt(data).onMoveLeft(_this.broad.getChildAt(data));
        };
        // viewGame.socket.on('AddPlayer',this.addPlayer);
        this.createViewGame(this.player);
        // viewGame.socket.on('MoveRight',this.moveRight)
        // viewGame.socket.on('MoveLeft',this.moveLeft)
    }
    viewGame.prototype.createViewGame = function (player1) {
        document.body.appendChild(this.app.view);
        var background = PIXI.Sprite.fromImage('../Picture/background.jpg');
        background.width = this.app.renderer.width;
        background.height = this.app.renderer.height;
        background.width = 1200;
        background.height = 640;
        this.field.addChild(background);
        this.app.stage.addChild(this.field);
        this.field.scale.set(1.4);
        this.createBroad(this.gametable, player1);
    };
    viewGame.prototype.createBroad = function (table, player1) {
        this.broad_main = new PIXI.Container();
        this.broad = new PIXI.Container();
        var container = new Container();
        var b;
        for (var i = 0; i < table.length; i++) {
            var square = void 0;
            var box = void 0;
            if (i == 0) {
                box = new BoxContainer_1.Box(table[i] + 9, 0);
                // box.height = 157;
                square = new SquareContainer_1.Square(table[i], 1, 0);
                box.position.set(102, 73);
                square.position.set(102, 73);
            }
            else if (i == 6) {
                box = new BoxContainer_1.Box(table[i] + 9, 6);
                // box.height = 157;
                square = new SquareContainer_1.Square(table[i], 2, 6);
                box.position.set(575, 73);
                square.position.set(575, 73);
            }
            else {
                if (i > 0 && i < 6)
                    square = new SquareContainer_1.Square(table[i], 0, i, player1);
                else
                    square = new SquareContainer_1.Square(table[i], 0, i);
                box = new BoxContainer_1.Box(table[i]);
                var a = (112 + 77 * i) - Math.floor(i / 6) * ((112 + 77 * i) - 574 + (i - 6) * 77);
                var b_1 = 150 - 77 * Math.floor(i / 6);
                box.position.set(a, b_1);
                square.position.set(a, b_1);
            }
            this.broad.addChild(square);
            container.addChild(box);
        }
        var home1 = new SquareContainer_1.Square(0, 0, 12);
        home1.position.set(355, 318);
        var home2 = new SquareContainer_1.Square(0, 0, 13);
        home2.position.set(355, -100);
        var spread = new SquareContainer_1.Square(0, 0, 14);
        spread.position.set(10, 10);
        this.broad.addChild(home1, home2, spread);
        var h1 = new BoxContainer_1.Box(0, 1);
        h1.position.set(300, 305);
        var h2 = new BoxContainer_1.Box(0, 1);
        h2.position.set(300, -105);
        container.addChild(h1, h2);
        this.broad_main.addChild(this.broad);
        this.broad_main.addChild(container);
        this.broad_main.position.set(200, 158);
        this.field.addChild(this.broad_main);
        this.field.scale.set(0.7);
    };
    return viewGame;
}());
viewGame.turn = false;
exports.viewGame = viewGame;
//# sourceMappingURL=viewGame.js.map