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
var HowlerUtils_1 = require("../HowlerUtils");
var App_1 = require("../Const/App");
var screenfull = require('screenfull');
// var StatusBar = require('cordova-plugin-statusbar');
var viewGame = (function () {
    function viewGame() {
        var _this = this;
        this.FinishGame = false;
        // onDeviceReady = () => {
        //     if (StatusBar.isVisible = true) {
        //         StatusBar.hide();
        //     }
        //
        // }
        this.ReSize = function () {
            if (!App_1.App.IsWeb || screenfull.isFullScreen) {
                App_1.App.W = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                App_1.App.H = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                if (App_1.App.IsWeb) {
                    // let zoomBrowser = Math.round(window.devicePixelRatio * 100);
                    // if (zoomBrowser != 100) {
                    //     w = window.innerWidth;
                    //     h = window.innerHeight;
                    // } else {
                    //     w = window.screen.width;
                    //     h = window.screen.height;
                    // }
                }
            }
        };
        this.createLogin = function () {
            _this.login_broad = new LoginView_1.Login();
            _this.app.stage.addChild(_this.login_broad);
        };
        this.createGame = function () {
            viewGame.Game = new PIXI.Container();
            _this.game_broad = new Game_1.Game();
            _this.chat_board = new Chat_1.Chat();
            _this.resetGame = new Button_1.Button(950, 50, "", App_1.App.AssetDir + "Picture/IU/refreshbtn.png");
            _this.resetGame.scale.set(0.75);
            _this.resetGame.visible = false;
            _this.resetGame.onClick = function () {
                viewGame.player.emit("reload", viewGame.game_turn);
                viewGame.turn = viewGame.game_turn;
                _this.game_broad.reloadGame();
                _this.game_broad.clock.restart();
                TweenMax.to(_this.game_broad.flag, 0.5, { x: 700, y: 460 });
                _this.resetGame.visible = false;
            };
            _this.leftGame = new Button_1.Button(1110, 50, "", App_1.App.AssetDir + "Picture/IU/outroom.png");
            _this.leftGame.onClick = function () {
                _this.game_broad.reloadGame();
                _this.onWait();
                _this.game_broad.broad.getChildAt(1).onStopMove(_this.game_broad.broad.getChildAt(1));
                viewGame.player.emit("left room");
                viewGame.player.emit("join room");
            };
            _this.wait = PIXI.Sprite.fromImage(App_1.App.AssetDir + 'Picture/wait.png');
            _this.wait.scale.set(0.7);
            _this.wait.visible = false;
            _this.wait.position.set(330, 164);
            viewGame.Game.addChild(_this.game_broad, _this.chat_board, _this.resetGame, _this.leftGame, _this.wait);
            viewGame.Game.visible = false;
            _this.app.stage.addChild(viewGame.Game);
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
            viewGame.player.on("user left", _this.onUserLeft);
        };
        this.onUserLeft = function () {
            HowlerUtils_1.HowlerUtils.DiDau.play();
            viewGame.turn = true;
            _this.game_broad.reloadGame();
            _this.FinishGame = false;
        };
        this.onRestart = function () {
            if (_this.last_turn == true) {
                _this.resetGame.visible = true;
                _this.FinishGame = false;
            }
        };
        this.onReLoad = function (data) {
            _this.game_broad.reloadGame();
            _this.game_broad.clock.restart();
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
            HowlerUtils_1.HowlerUtils.QueenGarden.stop();
            HowlerUtils_1.HowlerUtils.Orbis.play();
            _this.wait.visible = false;
            viewGame.player.color = data.color;
            viewGame.player.oppname = data.oppname;
            _this.game_broad.clock.restart();
        };
        this.onWait = function () {
            HowlerUtils_1.HowlerUtils.QueenGarden.play();
            _this.game_broad.broad.getChildAt(1).onStopMove(_this.game_broad.broad.getChildAt(1));
            _this.wait.visible = true;
            TweenMax.to(_this.game_broad.flag, 0.5, { x: 700, y: 460 });
        };
        this.onEndGame = function (data) {
            HowlerUtils_1.HowlerUtils.Orbis.stop();
            _this.FinishGame = true;
            _this.game_broad.clock.stop();
            _this.game_broad.broad.getChildAt(1).onStopMove(_this.game_broad.broad.getChildAt(1));
            console.log(data.src);
            if (data.result == 1) {
                setTimeout(function () {
                    if (data.src > 10)
                        HowlerUtils_1.HowlerUtils.TRBT.play();
                    else
                        HowlerUtils_1.HowlerUtils.ConGa.play();
                }, 2500);
                _this.result = new PIXI.Sprite(Utils_1.Utils.Win);
                _this.result.position.set(520, 395);
                _this.game_broad.addChild(_this.result);
                _this.last_turn = true;
            }
            else if (data.result == 3) {
                setTimeout(function () {
                    if (data.src > 10)
                        HowlerUtils_1.HowlerUtils.Hazz.play();
                    else
                        HowlerUtils_1.HowlerUtils.Othua.play();
                }, 2500);
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
            viewGame.game_turn = data.gameturn;
            _this.last_turn = data.gameturn;
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
            viewGame.turn = data.turn;
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
        ;
        this.app = new PIXI.Application(App_1.App.width, App_1.App.height, { backgroundColor: 0x1099bb });
        document.body.appendChild(this.app.view);
        this.eventPlayer();
        this.createLogin();
        this.createGame();
        // if (!App.IsWeb) {
        this.ReSize();
        this.app.stage.scale.set(App_1.App.W / App_1.App.width, App_1.App.H / App_1.App.height);
        // }
    }
    return viewGame;
}());
viewGame.turn = true;
exports.viewGame = viewGame;
// export let viewGame = new viewGame(); 
//# sourceMappingURL=viewGame.js.map