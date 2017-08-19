/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
import * as PIXI from "pixi.js"
import * as gsap from "gsap"
import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import {Player} from "../Player";
import {Utils} from "../Utils";
import TweenMax = gsap.TweenMax;
import {Game} from "./Game";
import {Login} from "./LoginView";
import {App} from "../Const/App";
import {Panel} from "../IU/Panel";
import {Hall} from "./Hallview";
import {Sound} from "../Const/Sound";
import {Setting} from "../IU/Setting";
import {Invite} from "../IU/Invite";
var screenfull = require('screenfull');
// var StatusBar = require('cordova-plugin-statusbar');
export class viewGame {
    app;
    static turn = true;
    static game_turn;
    public static player: Player;
    private FinishGame = false;
    static login_broad: Login;
    static Hall: Hall;
    static Game: Game;
    result: PIXI.Sprite;
    static sound: Sound = new Sound();
    static Setting: Setting;
    static Invite: Invite;
    static Avatar_ID:number = Math.floor(Math.random() * 15) ;
    constructor() {
        viewGame.player = new Player();
        if (!App.IsWeb){
            this.ReSize();
            this.app = new PIXI.Application(App.W, App.H);
            this.app.stage.scale.set(App.W / App.width, App.H / App.height);

        }
        else
        this.app = new PIXI.Application(App.width, App.height);
        document.body.appendChild(this.app.view);
        this.app.stage.addChild(Panel.panel);
        this.createLogin();
        this.createGame();
        this.createHall();
        this.eventPlayer();
        viewGame.Setting = new Setting();
        viewGame.Invite = new Invite();
        this.app.stage.addChild(viewGame.Setting, viewGame.Invite);

    }

    // onDeviceReady = () => {
    //     if (StatusBar.isVisible = true) {
    //         StatusBar.hide();
    //     }
    //
    // }
    ReSize = () => {
        if (!App.IsWeb || screenfull.isFullScreen) {
            App.W = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            App.H = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            if (App.IsWeb) {
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

    }
    createLogin = () => {
        viewGame.login_broad = new Login();
        this.app.stage.addChild(viewGame.login_broad);
    }
    createHall = () => {
        viewGame.Hall = new Hall();
        viewGame.Hall.visible = false;
        this.app.stage.addChild(viewGame.Hall);
    }
    createGame = () => {
        viewGame.Game = new Game(viewGame.player);
        viewGame.Game.visible = false;
        this.app.stage.addChild(viewGame.Game);
    }


    eventPlayer = () => {
        viewGame.player.on("start game", this.onStartGame);
        viewGame.player.on("turn color", this.onTurnColor);
        viewGame.player.on("set turn", this.onSetTurn);
        viewGame.player.on("opponent move", this.onMove);
        viewGame.player.on("game_end", this.onEndGame);
        viewGame.player.on("wait player", viewGame.Game.onWait);
        viewGame.player.on("new message", (data: any) => {
            viewGame.Game.chat_board.messageBox.addChildrent(new PIXI.Text(data.playername + " : " + data.message));
        });
        viewGame.player.on("End_turn", this.onAutoEndturn);
        viewGame.player.on("user left", this.onUserLeft);
        viewGame.player.on("continue_game", this.onContinue);
        viewGame.player.on("reload_first", this.onFirst);
        viewGame.player.on("reload_last", this.onLast);
        viewGame.player.on("OK", this.onOK);
        viewGame.player.on("NO", this.onNO);
        viewGame.player.on("Ẹnjoy", this.onEnjoy);
    }
    onOK = () => {
        viewGame.login_broad.visible = false;
        viewGame.Hall.avatar.show(viewGame.Avatar_ID);
        viewGame.Hall.visible = true;
        viewGame.sound.play_BG("Wait");
        clearTimeout(viewGame.login_broad.Connect);
        viewGame.Game.My_name.setName("" + viewGame.player.username);
    }
    onNO = () => {
        Panel.showMessageDialog("Tên đã tồn tại :(", 1500);
    }
    onEnjoy = (data: any) => {
        Panel.showConfirmDialog("Người chơi " + data.key + " muốn bạn chơi cùng ? ", {
            text: "Có",
            action: () => {
                viewGame.player.emit("join room", data.id);
            }
        }, {
            text: "Không",
            action: () => {
            }
        })
    }
    onFirst = () => {
        viewGame.sound.play_BG("Play");
        viewGame.game_turn = true;
        viewGame.turn = true;
        viewGame.Game.reloadGame2();
        TweenMax.to(viewGame.Game.flag, 0.5, {x: 350, y: 485});
        viewGame.Game.clock.restart();
        this.FinishGame = false;

    }
    onLast = () => {
        viewGame.sound.play_BG("Play");
        viewGame.game_turn = false;
        viewGame.turn = true;
        viewGame.Game.reloadGame2();
        TweenMax.to(viewGame.Game.flag, 0.5, {x: 700, y: 30})
        viewGame.Game.clock.restart();
        this.FinishGame = false;
        viewGame.Game.broad.getChildAt(1).onStopMove(viewGame.Game.broad.getChildAt(1));
    }

    onContinue = () => {
        Panel.showConfirmDialog("Bạn muốn chơi lại chứ ?", {
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

    }
    onUserLeft = () => {
        viewGame.sound.play_Voice("DiDau");
        viewGame.turn = true;
        viewGame.Game.reloadGame();
        viewGame.Game.wait.run();
        TweenMax.to(viewGame.Game.flag, 0.5, {x: 350, y: 485})
        viewGame.Game.broad.getChildAt(1).onStopMove(viewGame.Game.broad.getChildAt(1));
        this.FinishGame = false;
    }

    onAutoEndturn = () => {
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
                    viewGame.player.emit("move", {posi: i + 6, dr: bool});
                    if (bool == false)
                        viewGame.Game.broad.getChildAt(i).onMoveRight(viewGame.Game.broad.getChildAt(i))
                    else
                        viewGame.Game.broad.getChildAt(i).onMoveLeft(viewGame.Game.broad.getChildAt(i))
                    return;
                }
            }
        }

    }
    onStartGame = (data: any) => {
        viewGame.sound.play_BG("Play");
        viewGame.Game.wait.stop();
        viewGame.player.color = data.color;
        viewGame.player.oppname = data.oppname;
        viewGame.Game.Opp_name.setName("" + viewGame.player.oppname);
        viewGame.Game.clock.restart();
    }
    onEndGame = (data: any) => {
        viewGame.sound.play_BG("Wait");
        this.FinishGame = true;
        viewGame.Game.clock.stop();
        viewGame.Game.broad.getChildAt(1).onStopMove(viewGame.Game.broad.getChildAt(1));
        if (data.result == 1) {
            setTimeout(() => {
                if (data.src > 10)
                    viewGame.sound.play_Voice("TRBT");
                else
                    viewGame.sound.play_Voice("ConGa");

            }, 2500);
            this.result = new PIXI.Sprite(Utils.Win);
            this.result.position.set(520, 395);
            viewGame.Game.addChild(this.result);
        }
        else if (data.result == 3) {
            setTimeout(() => {
                if (data.src > 10)
                    viewGame.sound.play_Voice("Hazz")
                else
                    viewGame.sound.play_Voice("Othua")
            }, 2500)
            this.result = new PIXI.Sprite(Utils.Lose);
            this.result.position.set(520, 395);
            viewGame.Game.addChild(this.result);
        }
        else if (data.result == 2) {
            this.result = new PIXI.Sprite(Utils.Daw);
            this.result.position.set(520, 395);
            viewGame.Game.addChild(this.result);

        }
    }
    onSetTurn = (data: any) => {
        viewGame.turn = true;
        viewGame.game_turn = data.gameturn;
        if (viewGame.game_turn == true) {
            viewGame.Game.broad.getChildAt(1).onStartMove(viewGame.Game.broad.getChildAt(1));
            TweenMax.to(viewGame.Game.flag, 0.5, {x: 350, y: 485})

        }
        else {
            viewGame.Game.broad.getChildAt(1).onStopMove(viewGame.Game.broad.getChildAt(1));
            TweenMax.to(viewGame.Game.flag, 0.5, {x: 700, y: 30})
        }
    }
    onTurnColor = (data: any) => {
        viewGame.turn = data.turn;
        viewGame.Game.clock.restart();
        if (viewGame.turn == viewGame.game_turn) {
            viewGame.Game.broad.getChildAt(1).onStartMove(viewGame.Game.broad.getChildAt(1));
            TweenMax.to(viewGame.Game.flag, 0.5, {x: 350, y: 485})
        }
        else {
            viewGame.Game.broad.getChildAt(1).onStopMove(viewGame.Game.broad.getChildAt(1));
            TweenMax.to(viewGame.Game.flag, 0.5, {x: 700, y: 30})
        }

    }
    onMove = (data: any) => {
        viewGame.Game.clock.stop();
        if (data.dr == false) {
            viewGame.Game.broad.getChildAt(data.posi).onMoveRight(viewGame.Game.broad.getChildAt(data.posi));
        }
        else {
            viewGame.Game.broad.getChildAt(data.posi).onMoveLeft(viewGame.Game.broad.getChildAt(data.posi));
        }
    }

}