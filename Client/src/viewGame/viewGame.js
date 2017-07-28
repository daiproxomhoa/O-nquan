"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
var PIXI = require("pixi.js");
var SquareContainer_1 = require("../ObjectGame/SquareContainer");
var gsap = require("gsap");
var Container = PIXI.Container;
var BoxContainer_1 = require("../ObjectGame/BoxContainer");
var Player_1 = require("../Player");
var Utils_1 = require("../Utils");
var TextField_1 = require("../IU/TextField");
var Button_1 = require("../IU/Button");
var ScollPane_1 = require("../IU/ScollPane");
var Clock_1 = require("../ObjectGame/Clock");
var TweenMax = gsap.TweenMax;
var viewGame = (function () {
    function viewGame() {
        var _this = this;
        this.app = new PIXI.Application(1200, 640, { backgroundColor: 0x1099bb });
        // gametable = [7, 5, 5, 1, 0, 0, 7, 5, 5, 1, 0, 0, 7, 7];
        this.gametable = [1, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5, 0, 0];
        this.field = new PIXI.Container();
        this.FinishGame = false;
        this.createFlag = function () {
            _this.flag = new PIXI.Sprite(Utils_1.Utils.Flag);
            _this.flag.scale.set(0.65);
            _this.field.addChild(_this.flag);
        };
        this.createClock = function () {
            viewGame.clock = new Clock_1.clock();
            viewGame.clock.position.set(70, 205);
            _this.field.addChild(viewGame.clock);
        };
        this.eventPlayer = function () {
            viewGame.player.on("start game", _this.onStartGame);
            viewGame.player.on("turn color", _this.onTurnColor);
            viewGame.player.on("set turn", _this.onSetTurn);
            viewGame.player.on("opponent move", _this.onMove);
            viewGame.player.on("game_end", _this.onEndGame);
            viewGame.player.on("wait player", _this.onWait);
            viewGame.player.on("new message", function (data) {
                _this.messageBox.addChildrent(new PIXI.Text(data.playername + " : " + data.message));
            });
            // viewGame.player.on("End_turn",this.onAutoEndturn);
        };
        this.onAutoEndturn = function () {
            if (_this.FinishGame == false) {
                var bool = void 0;
                var rd = Math.round(Math.random());
                if (rd == 1)
                    bool = true;
                else
                    bool = false;
                var Square_1 = _this.broad.children;
                for (var i = 1; i < 6; i++) {
                    if (Square_1[i].children.length != 0) {
                        viewGame.player.emit("move", { posi: i + 6, dr: bool });
                        if (bool == false)
                            _this.broad.getChildAt(i).onMoveRight(_this.broad.getChildAt(i));
                        else
                            _this.broad.getChildAt(i).onMoveLeft(_this.broad.getChildAt(i));
                        return;
                    }
                }
            }
        };
        this.onStartGame = function (data) {
            _this.wait.visible = false;
            viewGame.player.color = data.color;
            viewGame.player.oppname = data.oppname;
            viewGame.clock.restart();
        };
        this.onWait = function () {
            _this.broad.getChildAt(1).onStopMove(_this.broad.getChildAt(1));
            _this.wait.position.set(330, 164);
            _this.wait.scale.set(0.7);
            _this.field.addChild(_this.wait);
        };
        this.onEndGame = function (data) {
            console.log("End game :" + data.result);
            _this.FinishGame = true;
            _this.broad.getChildAt(1).onStopMove(_this.broad.getChildAt(1));
            if (data.result == 1) {
                var win = new PIXI.Sprite(Utils_1.Utils.Win);
                win.position.set(520, 395);
                _this.field.addChild(win);
            }
            else if (data.result == 3) {
                var win = new PIXI.Sprite(Utils_1.Utils.Lose);
                win.position.set(520, 395);
                _this.field.addChild(win);
            }
            else if (data.result == 2) {
                var win = new PIXI.Sprite(Utils_1.Utils.Daw);
                win.position.set(520, 395);
                _this.field.addChild(win);
            }
        };
        this.onSetTurn = function (data) {
            viewGame.game_turn = data;
            if (viewGame.game_turn == true) {
                _this.broad.getChildAt(1).onStartMove(_this.broad.getChildAt(1));
                TweenMax.to(_this.flag, 0.5, { x: 700, y: 460 });
            }
            else {
                _this.broad.getChildAt(1).onStopMove(_this.broad.getChildAt(1));
                TweenMax.to(_this.flag, 0.5, { x: 370, y: 90 });
            }
        };
        this.onTurnColor = function (data) {
            viewGame.turn = data;
            console.log(data);
            viewGame.clock.restart();
            if (viewGame.turn == viewGame.game_turn) {
                _this.broad.getChildAt(1).onStartMove(_this.broad.getChildAt(1));
                TweenMax.to(_this.flag, 0.5, { x: 700, y: 460 });
            }
            else {
                _this.broad.getChildAt(1).onStopMove(_this.broad.getChildAt(1));
                TweenMax.to(_this.flag, 0.5, { x: 370, y: 90 });
            }
        };
        this.onMove = function (data) {
            viewGame.clock.stop();
            if (data.dr == false) {
                _this.broad.getChildAt(data.posi).onMoveRight(_this.broad.getChildAt(data.posi));
            }
            else {
                _this.broad.getChildAt(data.posi).onMoveLeft(_this.broad.getChildAt(data.posi));
            }
        };
        this.createLogin = function () {
            _this.login = new PIXI.Container();
            var backgroud = PIXI.Sprite.fromImage('../Picture/Login.png');
            backgroud.width = 1200;
            backgroud.height = 640;
            _this.app.stage.addChild(_this.login);
            var txtMessage = new TextField_1.TextField(145, 400);
            txtMessage.setText('User name ');
            txtMessage.scale.set(0.4);
            var Loginbtn = new Button_1.Button(510, 400, "", "../Picture/IU/loginbtn.png");
            Loginbtn.setSize(new PIXI.Point(100, 50));
            Loginbtn.onClick = function () {
                if (txtMessage.getText() != "") {
                    viewGame.player.emit("login", txtMessage.getText());
                    txtMessage.setText("");
                    _this.login.alpha = 0;
                    _this.login.position.set(-1000);
                }
            };
            _this.login.addChild(backgroud, txtMessage, Loginbtn);
            _this.wait = PIXI.Sprite.fromImage('../Picture/wait.png');
        };
        viewGame.player = new Player_1.Player(this);
        this.eventPlayer();
        this.createViewGame();
        this.createLogin();
        this.createClock();
        this.createFlag();
    }
    viewGame.prototype.createViewGame = function () {
        document.body.appendChild(this.app.view);
        var background = PIXI.Sprite.fromImage('../Picture/background.png');
        background.width = this.app.renderer.width;
        background.height = this.app.renderer.height;
        background.width = 1200;
        background.height = 640;
        this.field.addChild(background);
        this.app.stage.addChild(this.field);
        this.createBroad(this.gametable);
    };
    viewGame.prototype.createBroad = function (table) {
        this.broad_main = new PIXI.Container();
        this.broad = new PIXI.Container();
        var container = new Container();
        var b;
        for (var i = 0; i < table.length - 2; i++) {
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
                    square = new SquareContainer_1.Square(table[i], 0, i);
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
        var home1 = new SquareContainer_1.Square(table[12], 0, 12);
        home1.position.set(355, 318);
        var home2 = new SquareContainer_1.Square(table[13], 0, 13);
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
        // this.field.scale.set(1);
        this.createChat();
        // this.field.scale.set(1)
    };
    viewGame.prototype.createChat = function () {
        this.chatboard = new PIXI.Container();
        this.chatboard.position.set(900, 0);
        this.field.addChild(this.chatboard);
        this.messageBox = new ScollPane_1.ScrollPane(270, 300);
        this.messageBox.x = 10;
        this.messageBox.y = 280;
        var txtMessage = new TextField_1.TextField(10, 610);
        txtMessage.scale.set(0.3);
        var sendBtn = new Button_1.Button(258, 610, "", "../Picture/IU/sendmsg.png");
        sendBtn.setSize(new PIXI.Point(40, 30));
        sendBtn.onClick = function () {
            if (txtMessage.getText() != "") {
                viewGame.player.emit("send message", txtMessage.getText());
                txtMessage.setText("");
            }
        };
        this.chatboard.addChild(this.messageBox, txtMessage, sendBtn);
    };
    return viewGame;
}());
viewGame.turn = true;
exports.viewGame = viewGame;
// export let viewGame = new viewGame(); 
//# sourceMappingURL=viewGame.js.map