"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
const PIXI = require("pixi.js");
const gsap = require("gsap");
const Player_1 = require("../Player");
const Utils_1 = require("../Utils");
var TweenMax = gsap.TweenMax;
const Game_1 = require("./Game");
const LoginView_1 = require("./LoginView");
const App_1 = require("../Const/App");
const Panel_1 = require("../IU/Panel");
const Hallview_1 = require("./Hallview");
const Sound_1 = require("../Const/Sound");
const Setting_1 = require("../IU/Setting");
const Invite_1 = require("../IU/Invite");
var screenfull = require('screenfull');
// var StatusBar = require('cordova-plugin-statusbar');
class viewGame {
    constructor() {
        this.FinishGame = false;
        // onDeviceReady = () => {
        //     if (StatusBar.isVisible = true) {
        //         StatusBar.hide();
        //     }
        //
        // }
        this.ReSize = () => {
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
        this.createLogin = () => {
            viewGame.login_broad = new LoginView_1.Login();
            this.app.stage.addChild(viewGame.login_broad);
        };
        this.createHall = () => {
            viewGame.Hall = new Hallview_1.Hall();
            viewGame.Hall.visible = false;
            this.app.stage.addChild(viewGame.Hall);
        };
        this.createGame = () => {
            viewGame.Game = new PIXI.Container();
            this.game_broad = new Game_1.Game(viewGame.player);
            viewGame.Game.addChild(this.game_broad);
            viewGame.Game.visible = false;
            this.app.stage.addChild(viewGame.Game);
        };
        this.eventPlayer = () => {
            viewGame.player.on("start game", this.onStartGame);
            viewGame.player.on("turn color", this.onTurnColor);
            viewGame.player.on("set turn", this.onSetTurn);
            viewGame.player.on("opponent move", this.onMove);
            viewGame.player.on("game_end", this.onEndGame);
            viewGame.player.on("wait player", this.game_broad.onWait);
            viewGame.player.on("new message", (data) => {
                this.game_broad.chat_board.messageBox.addChildrent(new PIXI.Text(data.playername + " : " + data.message));
            });
            viewGame.player.on("End_turn", this.onAutoEndturn);
            viewGame.player.on("user left", this.onUserLeft);
            viewGame.player.on("continue_game", this.onContinue);
            viewGame.player.on("reload_first", this.onFirst);
            viewGame.player.on("reload_last", this.onLast);
            viewGame.player.on("OK", this.onOK);
            viewGame.player.on("NO", this.onNO);
            viewGame.player.on("Ẹnjoy", this.onEnjoy);
        };
        this.onOK = () => {
            viewGame.login_broad.visible = false;
            viewGame.Hall.visible = true;
            viewGame.sound.play_BG("Wait");
            clearTimeout(viewGame.login_broad.Connect);
            this.game_broad.My_name.setName("" + viewGame.player.username);
        };
        this.onNO = () => {
            Panel_1.Panel.showMessageDialog("Tên đã tồn tại :(", 1500);
        };
        this.onEnjoy = (data) => {
            Panel_1.Panel.showConfirmDialog("Người chơi " + data.key + " muốn bạn chơi cùng ? ", {
                text: "Có",
                action: () => {
                    viewGame.player.emit("join room", data.id);
                }
            }, {
                text: "Không",
                action: () => {
                }
            });
        };
        this.onFirst = () => {
            viewGame.sound.play_BG("Play");
            viewGame.game_turn = true;
            viewGame.turn = true;
            this.game_broad.reloadGame2();
            TweenMax.to(this.game_broad.flag, 0.5, { x: 700, y: 460 });
            this.game_broad.clock.restart();
            this.FinishGame = false;
        };
        this.onLast = () => {
            viewGame.sound.play_BG("Play");
            viewGame.game_turn = false;
            viewGame.turn = true;
            this.game_broad.reloadGame2();
            TweenMax.to(this.game_broad.flag, 0.5, { x: 370, y: 90 });
            this.game_broad.clock.restart();
            this.FinishGame = false;
            this.game_broad.broad.getChildAt(1).onStopMove(this.game_broad.broad.getChildAt(1));
        };
        this.onContinue = () => {
            Panel_1.Panel.showConfirmDialog("Bạn muốn chơi lại chứ ?", {
                text: "Có",
                action: () => {
                    viewGame.player.emit("accepted", true);
                }
            }, {
                text: "Không",
                action: () => {
                    viewGame.player.emit("accepted", false);
                }
            });
        };
        this.onUserLeft = () => {
            viewGame.sound.play_Voice("DiDau");
            viewGame.turn = true;
            this.game_broad.reloadGame();
            this.game_broad.wait.run();
            TweenMax.to(this.game_broad.flag, 0.5, { x: 700, y: 460 });
            this.game_broad.broad.getChildAt(1).onStopMove(this.game_broad.broad.getChildAt(1));
            this.FinishGame = false;
        };
        this.onAutoEndturn = () => {
            if (this.FinishGame == false) {
                let bool;
                let rd = Math.round(Math.random());
                if (rd == 1)
                    bool = true;
                else
                    bool = false;
                let Square = this.game_broad.broad.children;
                for (let i = 1; i < 6; i++) {
                    if (Square[i].children.length != 0) {
                        viewGame.player.emit("move", { posi: i + 6, dr: bool });
                        if (bool == false)
                            this.game_broad.broad.getChildAt(i).onMoveRight(this.game_broad.broad.getChildAt(i));
                        else
                            this.game_broad.broad.getChildAt(i).onMoveLeft(this.game_broad.broad.getChildAt(i));
                        return;
                    }
                }
            }
        };
        this.onStartGame = (data) => {
            ;
            viewGame.sound.play_BG("Play");
            this.game_broad.wait.stop();
            viewGame.player.color = data.color;
            viewGame.player.oppname = data.oppname;
            this.game_broad.Opp_name.setName("" + viewGame.player.oppname);
            this.game_broad.clock.restart();
        };
        this.onEndGame = (data) => {
            viewGame.sound.play_BG("Wait");
            this.FinishGame = true;
            this.game_broad.clock.stop();
            this.game_broad.broad.getChildAt(1).onStopMove(this.game_broad.broad.getChildAt(1));
            if (data.result == 1) {
                setTimeout(() => {
                    if (data.src > 10)
                        viewGame.sound.play_Voice("TRBT");
                    else
                        viewGame.sound.play_Voice("ConGa");
                }, 2500);
                this.result = new PIXI.Sprite(Utils_1.Utils.Win);
                this.result.position.set(520, 395);
                this.game_broad.addChild(this.result);
            }
            else if (data.result == 3) {
                setTimeout(() => {
                    if (data.src > 10)
                        viewGame.sound.play_Voice("Hazz");
                    else
                        viewGame.sound.play_Voice("Othua");
                }, 2500);
                this.result = new PIXI.Sprite(Utils_1.Utils.Lose);
                this.result.position.set(520, 395);
                this.game_broad.addChild(this.result);
            }
            else if (data.result == 2) {
                this.result = new PIXI.Sprite(Utils_1.Utils.Daw);
                this.result.position.set(520, 395);
                this.game_broad.addChild(this.result);
            }
        };
        this.onSetTurn = (data) => {
            viewGame.turn = true;
            viewGame.game_turn = data.gameturn;
            if (viewGame.game_turn == true) {
                this.game_broad.broad.getChildAt(1).onStartMove(this.game_broad.broad.getChildAt(1));
                TweenMax.to(this.game_broad.flag, 0.5, { x: 700, y: 460 });
            }
            else {
                this.game_broad.broad.getChildAt(1).onStopMove(this.game_broad.broad.getChildAt(1));
                TweenMax.to(this.game_broad.flag, 0.5, { x: 370, y: 90 });
            }
        };
        this.onTurnColor = (data) => {
            viewGame.turn = data.turn;
            this.game_broad.clock.restart();
            if (viewGame.turn == viewGame.game_turn) {
                this.game_broad.broad.getChildAt(1).onStartMove(this.game_broad.broad.getChildAt(1));
                TweenMax.to(this.game_broad.flag, 0.5, { x: 700, y: 460 });
            }
            else {
                this.game_broad.broad.getChildAt(1).onStopMove(this.game_broad.broad.getChildAt(1));
                TweenMax.to(this.game_broad.flag, 0.5, { x: 370, y: 90 });
            }
        };
        this.onMove = (data) => {
            this.game_broad.clock.stop();
            if (data.dr == false) {
                this.game_broad.broad.getChildAt(data.posi).onMoveRight(this.game_broad.broad.getChildAt(data.posi));
            }
            else {
                this.game_broad.broad.getChildAt(data.posi).onMoveLeft(this.game_broad.broad.getChildAt(data.posi));
            }
        };
        viewGame.player = new Player_1.Player();
        this.app = new PIXI.Application(App_1.App.width, App_1.App.height, { backgroundColor: 0x1099bb });
        document.body.appendChild(this.app.view);
        this.app.stage.addChild(Panel_1.Panel.panel);
        this.createLogin();
        this.createGame();
        this.createHall();
        this.eventPlayer();
        viewGame.Setting = new Setting_1.Setting();
        viewGame.Invite = new Invite_1.Invite();
        this.app.stage.addChild(viewGame.Setting, viewGame.Invite);
        if (!App_1.App.IsWeb) {
            this.ReSize();
            this.app.stage.scale.set(App_1.App.W / App_1.App.width, App_1.App.H / App_1.App.height);
        }
    }
}
viewGame.turn = true;
viewGame.sound = new Sound_1.Sound();
exports.viewGame = viewGame;
//# sourceMappingURL=viewGame.js.map