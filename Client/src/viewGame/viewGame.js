"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
var PIXI = require("pixi.js");
var gsap = require("gsap");
var Player_1 = require("../Player");
var Utils_1 = require("../Utils");
var TweenMax = gsap.TweenMax;
var Game_1 = require("./Game");
var LoginView_1 = require("./LoginView");
var Chat_1 = require("./Chat");
var Button_1 = require("../IU/Button");
var viewGame = (function () {
    function viewGame() {
        var _this = this;
        this.app = new PIXI.Application(1200, 640, { backgroundColor: 0x1099bb });
        // gametable = [0 , 5, 0, 0, 1, 0, 7, 5, 5, 1, 0, 1, 7, 7];
        this.gametable = [1, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5, 0, 0];
        this.FinishGame = false;
        this.createLogin = function () {
            _this.login_broad = new LoginView_1.Login();
            _this.wait = PIXI.Sprite.fromImage('../Picture/wait.png');
            _this.app.stage.addChild(_this.login_broad);
        };
        this.createGame = function () {
            _this.Game = new PIXI.Container();
            _this.game_broad = new Game_1.Game();
            _this.chat_board = new Chat_1.Chat();
            _this.resetGame = new Button_1.Button(1110, 50, "", "../Picture/IU/refreshbtn.png");
            _this.resetGame.scale.set(0.75);
            _this.resetGame.onClick = function () {
                // this.Game.removeChildAt(0);
                // this.game_broad = new Game();
                // this.Game.addChildAt(0,this.game_broad);
                // console.log("nhu cc");
            };
            _this.Game.addChild(_this.game_broad, _this.chat_board, _this.resetGame);
            _this.app.stage.addChild(_this.Game);
        };
        this.eventPlayer = function () {
            viewGame.player.on("start game", _this.onStartGame);
            viewGame.player.on("turn color", _this.onTurnColor);
            viewGame.player.on("set turn", _this.onSetTurn);
            viewGame.player.on("opponent move", _this.onMove);
            viewGame.player.on("game_end", _this.onEndGame);
            viewGame.player.on("wait player", _this.onWait);
            viewGame.player.on("new message", function (data) {
                _this.chat_board.messageBox.addChildrent(new PIXI.Text(data.playername + " : " + data.message));
            });
            viewGame.player.on("End_turn", _this.onAutoEndturn);
        };
        this.onAutoEndturn = function () {
            if (_this.FinishGame == false) {
                var bool = void 0;
                var rd = Math.round(Math.random());
                if (rd == 1)
                    bool = true;
                else
                    bool = false;
                var Square = _this.game_broad.broad.children;
                for (var i = 1; i < 6; i++) {
                    if (Square[i].children.length != 0) {
                        viewGame.player.emit("move", { posi: i + 6, dr: bool });
                        if (bool == false)
                            _this.game_broad.broad.getChildAt(i).onMoveRight(_this.game_broad.broad.getChildAt(i));
                        else
                            _this.game_broad.broad.getChildAt(i).onMoveLeft(_this.game_broad.broad.getChildAt(i));
                        return;
                    }
                }
            }
        };
        this.onStartGame = function (data) {
            _this.wait.visible = false;
            viewGame.player.color = data.color;
            viewGame.player.oppname = data.oppname;
            _this.game_broad.clock.restart();
        };
        this.onWait = function () {
            _this.game_broad.broad.getChildAt(1).onStopMove(_this.game_broad.broad.getChildAt(1));
            _this.wait.position.set(330, 164);
            _this.wait.scale.set(0.7);
            _this.game_broad.addChild(_this.wait);
        };
        this.onEndGame = function (data) {
            console.log("End game :" + data.result);
            _this.FinishGame = true;
            _this.game_broad.clock.stop();
            _this.game_broad.broad.getChildAt(1).onStopMove(_this.game_broad.broad.getChildAt(1));
            if (data.result == 1) {
                var win = new PIXI.Sprite(Utils_1.Utils.Win);
                win.position.set(520, 395);
                _this.game_broad.addChild(win);
            }
            else if (data.result == 3) {
                var win = new PIXI.Sprite(Utils_1.Utils.Lose);
                win.position.set(520, 395);
                _this.game_broad.addChild(win);
            }
            else if (data.result == 2) {
                var win = new PIXI.Sprite(Utils_1.Utils.Daw);
                win.position.set(520, 395);
                _this.game_broad.addChild(win);
            }
        };
        this.onSetTurn = function (data) {
            viewGame.game_turn = data;
            if (viewGame.game_turn == true) {
                _this.game_broad.broad.getChildAt(1).onStartMove(_this.game_broad.broad.getChildAt(1));
                TweenMax.to(_this.game_broad.flag, 0.5, { x: 700, y: 460 });
            }
            else {
                _this.game_broad.broad.getChildAt(1).onStopMove(_this.game_broad.broad.getChildAt(1));
                TweenMax.to(_this.game_broad.flag, 0.5, { x: 370, y: 90 });
            }
        };
        this.onTurnColor = function (data) {
            viewGame.turn = data;
            console.log(data);
            _this.game_broad.clock.restart();
            if (viewGame.turn == viewGame.game_turn) {
                _this.game_broad.broad.getChildAt(1).onStartMove(_this.game_broad.broad.getChildAt(1));
                TweenMax.to(_this.game_broad.flag, 0.5, { x: 700, y: 460 });
            }
            else {
                _this.game_broad.broad.getChildAt(1).onStopMove(_this.game_broad.broad.getChildAt(1));
                TweenMax.to(_this.game_broad.flag, 0.5, { x: 370, y: 90 });
            }
        };
        this.onMove = function (data) {
            _this.game_broad.clock.stop();
            if (data.dr == false) {
                _this.game_broad.broad.getChildAt(data.posi).onMoveRight(_this.game_broad.broad.getChildAt(data.posi));
            }
            else {
                _this.game_broad.broad.getChildAt(data.posi).onMoveLeft(_this.game_broad.broad.getChildAt(data.posi));
            }
        };
        viewGame.player = new Player_1.Player(this);
        document.body.appendChild(this.app.view);
        this.eventPlayer();
        this.createGame();
        this.createLogin();
    }
    return viewGame;
}());
viewGame.turn = true;
exports.viewGame = viewGame;
// export let viewGame = new viewGame(); 
//# sourceMappingURL=viewGame.js.map