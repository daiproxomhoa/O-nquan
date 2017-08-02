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
            _this.resetGame.visible = false;
            _this.resetGame.onClick = function () {
                viewGame.player.emit("reload", viewGame.game_turn);
                viewGame.turn = viewGame.game_turn;
                _this.game_broad.reloadGame();
                TweenMax.to(_this.game_broad.flag, 0.5, { x: 700, y: 460 });
                _this.resetGame.visible = false;
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
            viewGame.player.on("restart", _this.onRestart);
            viewGame.player.on("reload game", _this.onReLoad);
        };
        this.onRestart = function () {
            if (_this.last_turn == true) {
                _this.resetGame.visible = true;
                _this.FinishGame = false;
            }
        };
        this.onReLoad = function (data) {
            _this.game_broad.reloadGame();
            console.log(viewGame.turn + " " + viewGame.game_turn);
            viewGame.turn = data;
            _this.game_broad.broad.getChildAt(1).onStopMove(_this.game_broad.broad.getChildAt(1));
            _this.FinishGame = false;
            TweenMax.to(_this.game_broad.flag, 0.5, { x: 370, y: 90 });
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
                _this.result = new PIXI.Sprite(Utils_1.Utils.Win);
                _this.result.position.set(520, 395);
                _this.game_broad.addChild(_this.result);
                _this.last_turn = true;
            }
            else if (data.result == 3) {
                _this.result = new PIXI.Sprite(Utils_1.Utils.Lose);
                _this.result.position.set(520, 395);
                _this.game_broad.addChild(_this.result);
                _this.last_turn = false;
            }
            else if (data.result == 2) {
                if (_this.last_turn != false)
                    _this.last_turn = true;
                _this.result = new PIXI.Sprite(Utils_1.Utils.Daw);
                _this.result.position.set(520, 395);
                _this.game_broad.addChild(_this.result);
            }
        };
        this.onSetTurn = function (data) {
            viewGame.game_turn = data;
            _this.last_turn = data;
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