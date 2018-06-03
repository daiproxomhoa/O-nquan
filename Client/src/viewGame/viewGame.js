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
// /<preference name="StatusBarOverlaysWebView" value="true" />;
class viewGame {
    constructor() {
        this.FinishGame = false;
        // onDeviceReady = () => {
        //     if (StatusBar.isVisible = true) {
        //         StatusBar.hide();
        //     }
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
            viewGame.login_broad = new LoginView_1.Login(viewGame.player);
            this.app.stage.addChild(viewGame.login_broad);
        };
        this.createHall = () => {
            viewGame.Hall = new Hallview_1.Hall(viewGame.player);
            viewGame.Hall.visible = false;
            this.app.stage.addChild(viewGame.Hall);
        };
        this.createGame = () => {
            viewGame.Game = new Game_1.Game(viewGame.player);
            viewGame.Game.visible = false;
            this.app.stage.addChild(viewGame.Game);
        };
        this.eventPlayer = () => {
            viewGame.player.on("OK", this.onOK);
            viewGame.player.on("NO", this.onNO);
        };
        this.eventGame = () => {
            viewGame.player.on("wait player", viewGame.Game.onWait);
            viewGame.player.on("start game", this.onStartGame);
            viewGame.player.on("turn color", this.onTurnColor);
            viewGame.player.on("set turn", this.onSetTurn);
            viewGame.player.on("opponent move", this.onMove);
            viewGame.player.on("game_end", this.onEndGame);
            viewGame.Game.on("End turn", this.onAutoEndturn);
            viewGame.player.on("user left", this.onUserLeft);
            viewGame.player.on("continue_game", this.onContinue);
            viewGame.player.on("Reset", this.onReset);
            viewGame.player.on("Reset2", this.onReset2);
            viewGame.player.on("enjoy", this.onEnjoy);
            viewGame.player.on("setInfo", this.onSetInfo);
            viewGame.player.on("new message", (data) => {
                viewGame.Game.chat_board.messageBox.addChildrent(new PIXI.Text(data.playername + " : " + data.message));
            });
            viewGame.player.on("score", this.onScore);
            viewGame.player.on("room list", viewGame.Hall.getRoomList);
            viewGame.player.on("update_gold", (data) => {
                viewGame.player.gold = data;
                viewGame.Hall.avatar.show(data);
                viewGame.Game.My_name.show(data);
            });
        };
        this.onOK = () => {
            viewGame.player.emit("getInfo");
            viewGame.login_broad.visible = false;
            this.createGame();
            this.createHall();
            this.eventGame();
            viewGame.Invite = new Invite_1.Invite();
            this.app.stage.addChild(viewGame.Invite);
            viewGame.Hall.visible = true;
            viewGame.player.emit("get room list");
            viewGame.sound.play_BG("Wait");
            clearTimeout(viewGame.login_broad.Connect);
        };
        this.onNO = () => {
            Panel_1.Panel.showMessageDialog("Nick đang đang nhập", () => { }, false);
        };
        this.onSetInfo = (data) => {
            viewGame.player.id = data.id;
            viewGame.player.username = data.name;
            viewGame.player.avatar = data.avatar;
            viewGame.player.sex = data.sex;
            viewGame.player.gold = data.gold;
            console.log(data);
            viewGame.Hall.avatar.show(viewGame.player.gold, viewGame.player.sex, viewGame.player.avatar, viewGame.player.username);
        };
        this.onScore = (data) => {
            viewGame.Game.score1.text = data.x.toString() + "";
            viewGame.Game.score2.text = data.y.toString() + "";
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
        this.onReset2 = (data) => {
            viewGame.Game.My_name.show(data.me);
            viewGame.Game.Opp_name.show(data.you);
            console.log("CHUAN roi " + data.you + "      " + data.me);
        };
        this.onReset = (data) => {
            viewGame.sound.play_BG("Play");
            viewGame.game_turn = true;
            viewGame.turn = true;
            viewGame.Game.reloadGame2();
            viewGame.Game.clock.restart();
            viewGame.Game.My_name.show(data.me);
            viewGame.Game.Opp_name.show(data.you);
            this.FinishGame = false;
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
            viewGame.Game.reloadGame();
            viewGame.Game.wait.run();
            TweenMax.to(viewGame.Game.flag, 0.5, { x: 350, y: 485 });
            viewGame.Game.broad.getChildAt(1).onStopMove(viewGame.Game.broad.getChildAt(1));
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
                let Square = viewGame.Game.broad.children;
                for (let i = 1; i < 6; i++) {
                    if (Square[i].children.length != 0) {
                        viewGame.player.emit("move", { posi: i + 6, dr: bool });
                        if (bool == false)
                            viewGame.Game.broad.getChildAt(i).onMoveRight(viewGame.Game.broad.getChildAt(i));
                        else
                            viewGame.Game.broad.getChildAt(i).onMoveLeft(viewGame.Game.broad.getChildAt(i));
                        return;
                    }
                }
            }
        };
        this.onStartGame = (data) => {
            viewGame.player.emit("get room list");
            viewGame.sound.play_BG("Play");
            viewGame.Game.wait.stop();
            viewGame.player.color = data.color;
            viewGame.player.oppname = data.oppname;
            viewGame.player.oppAvatar = data.avatar;
            viewGame.player.oppsex = data.sex;
            viewGame.player.oppGold = data.gold;
            viewGame.Game.Opp_name.show(viewGame.player.oppGold, viewGame.player.oppsex, viewGame.player.oppAvatar, viewGame.player.oppname);
            viewGame.Game.clock.restart();
        };
        this.onEndGame = (data) => {
            viewGame.sound.play_BG("Wait");
            this.FinishGame = true;
            viewGame.Game.clock.stop();
            viewGame.Game.broad.getChildAt(1).onStopMove(viewGame.Game.broad.getChildAt(1));
            let result1;
            let result2;
            if (data.result == 1) {
                setTimeout(() => {
                    if (data.src > 10)
                        viewGame.sound.play_Voice("TRBT");
                    else
                        viewGame.sound.play_Voice("ConGa");
                }, 2500);
                result1 = new PIXI.Sprite(Utils_1.Utils.Win);
                result2 = new PIXI.Sprite(Utils_1.Utils.Lose);
                result1.anchor.set(0.5);
                result1.scale.set(1.34);
                result2.anchor.set(0.5);
                result2.scale.set(1.3);
                result1.position.set(585, 447);
                result2.position.set(600, 188);
                viewGame.Game.addChild(result2);
                viewGame.Game.addChild(result1);
            }
            else if (data.result == 3) {
                setTimeout(() => {
                    if (data.src > -10)
                        viewGame.sound.play_Voice("Hazz");
                    else
                        viewGame.sound.play_Voice("Othua");
                }, 2500);
                result1 = new PIXI.Sprite(Utils_1.Utils.Lose);
                result2 = new PIXI.Sprite(Utils_1.Utils.Win);
                result1.anchor.set(0.5);
                result1.scale.set(1.3);
                result2.anchor.set(0.5);
                result2.scale.set(1.34);
                result1.position.set(600, 447);
                result2.position.set(585, 190);
                viewGame.Game.addChild(result2);
                viewGame.Game.addChild(result1);
            }
            else if (data.result == 2) {
                setTimeout(() => {
                    viewGame.sound.play_Voice("Hoa");
                }, 2500);
                result1 = new PIXI.Sprite(Utils_1.Utils.Daw);
                result1.anchor.set(0.5);
                result1.scale.set(1.3);
                result1.position.set(600, 315);
                viewGame.Game.addChild(result1);
            }
        };
        this.onSetTurn = (data) => {
            viewGame.turn = true;
            viewGame.game_turn = data.gameturn;
            if (viewGame.game_turn == true) {
                viewGame.Game.broad.getChildAt(1).onStartMove(viewGame.Game.broad.getChildAt(1));
                TweenMax.to(viewGame.Game.flag, 0.5, { x: 350, y: 485 });
            }
            else {
                viewGame.Game.broad.getChildAt(1).onStopMove(viewGame.Game.broad.getChildAt(1));
                TweenMax.to(viewGame.Game.flag, 0.5, { x: 700, y: 30 });
            }
        };
        this.onTurnColor = (data) => {
            viewGame.turn = data.turn;
            viewGame.Game.clock.restart();
            if (viewGame.turn == viewGame.game_turn) {
                viewGame.Game.broad.getChildAt(1).onStartMove(viewGame.Game.broad.getChildAt(1));
                TweenMax.to(viewGame.Game.flag, 0.5, { x: 350, y: 485 });
            }
            else {
                viewGame.Game.broad.getChildAt(1).onStopMove(viewGame.Game.broad.getChildAt(1));
                TweenMax.to(viewGame.Game.flag, 0.5, { x: 700, y: 30 });
            }
        };
        this.onMove = (data) => {
            viewGame.Game.clock.stop();
            if (data.dr == false) {
                viewGame.Game.broad.getChildAt(data.posi).onMoveRight(viewGame.Game.broad.getChildAt(data.posi));
            }
            else {
                viewGame.Game.broad.getChildAt(data.posi).onMoveLeft(viewGame.Game.broad.getChildAt(data.posi));
            }
        };
        viewGame.player = new Player_1.Player();
        if (!App_1.App.IsWeb) {
            this.ReSize();
            this.app = new PIXI.Application(App_1.App.W, App_1.App.H);
            this.app.stage.scale.set(App_1.App.W / App_1.App.width, App_1.App.H / App_1.App.height);
        }
        else
            this.app = new PIXI.Application(App_1.App.width, App_1.App.height);
        document.body.appendChild(this.app.view);
        this.app.stage.addChild(Panel_1.Panel.panel);
        this.createLogin();
        this.eventPlayer();
        viewGame.Setting = new Setting_1.Setting();
        this.app.stage.addChild(viewGame.Setting);
    }
}
viewGame.turn = true;
viewGame.sound = new Sound_1.Sound();
exports.viewGame = viewGame;
//# sourceMappingURL=viewGame.js.map