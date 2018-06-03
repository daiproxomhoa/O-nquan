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
// /<preference name="StatusBarOverlaysWebView" value="true" />;
export class viewGame {
    app;
    static turn = true;
    static game_turn;
    public static player: Player;
    private FinishGame = false;
    static login_broad: Login;
    static Hall: Hall;
    static Game: Game;
    static sound: Sound = new Sound();
    static Setting: Setting;
    static Invite: Invite;
    constructor() {
        viewGame.player = new Player();
        if (!App.IsWeb) {
            this.ReSize();
            this.app = new PIXI.Application(App.W, App.H);
            this.app.stage.scale.set(App.W / App.width, App.H / App.height);

        }

        else
            this.app = new PIXI.Application(App.width, App.height);
            document.body.appendChild(this.app.view);
        this.app.stage.addChild(Panel.panel);
        this.createLogin();
        this.eventPlayer();
        viewGame.Setting = new Setting();
        this.app.stage.addChild(viewGame.Setting);

    }

    // onDeviceReady = () => {
    //     if (StatusBar.isVisible = true) {
    //         StatusBar.hide();
    //     }
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
        viewGame.login_broad = new Login(viewGame.player);
        this.app.stage.addChild(viewGame.login_broad);
    }
    createHall = () => {
        viewGame.Hall = new Hall(viewGame.player);
        viewGame.Hall.visible = false;
        this.app.stage.addChild(viewGame.Hall);
    }
    createGame = () => {
        viewGame.Game = new Game(viewGame.player);
        viewGame.Game.visible = false;
        this.app.stage.addChild(viewGame.Game);

    }


    eventPlayer = () => {
        viewGame.player.on("OK", this.onOK);
        viewGame.player.on("NO", this.onNO);

    }
    eventGame = () => {
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
        viewGame.player.on("new message", (data: any) => {
            viewGame.Game.chat_board.messageBox.addChildrent(new PIXI.Text(data.playername + " : " + data.message));
        });
        viewGame.player.on("score", this.onScore);
        viewGame.player.on("room list", viewGame.Hall.getRoomList);
        viewGame.player.on("update_gold", (data)=>{
            viewGame.player.gold=data;
            viewGame.Hall.avatar.show(data);
            viewGame.Game.My_name.show(data);
        });

    }
    onOK = () => {
        viewGame.player.emit("getInfo");
        viewGame.login_broad.visible = false;
        this.createGame();
        this.createHall();
        this.eventGame();
        viewGame.Invite = new Invite();
        this.app.stage.addChild(viewGame.Invite);
        viewGame.Hall.visible = true;
        viewGame.player.emit("get room list");
        viewGame.sound.play_BG("Wait");
        clearTimeout(viewGame.login_broad.Connect);
    }
    onNO = () => {
        Panel.showMessageDialog("Nick đang đang nhập",()=>{},false);
    }
    onSetInfo = (data: any) => {
        viewGame.player.id = data.id;
        viewGame.player.username = data.name;
        viewGame.player.avatar = data.avatar;
        viewGame.player.sex = data.sex;
        viewGame.player.gold =data.gold;
        console.log(data);
        viewGame.Hall.avatar.show(viewGame.player.gold,viewGame.player.sex, viewGame.player.avatar, viewGame.player.username);
    }
    onScore = (data) => {
        viewGame.Game.score1.text = data.x.toString() + "";
        viewGame.Game.score2.text = data.y.toString() + "";
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
    onReset2 =(data)=>{
        viewGame.Game.My_name.show(data.me);
        viewGame.Game.Opp_name.show(data.you);
        console.log("CHUAN roi "+ data.you +"      "+data.me);
    }
    onReset = (data) => {
        viewGame.sound.play_BG("Play");
        viewGame.game_turn = true;
        viewGame.turn = true;
        viewGame.Game.reloadGame2();
        viewGame.Game.clock.restart();
        viewGame.Game.My_name.show(data.me);
        viewGame.Game.Opp_name.show(data.you);
        this.FinishGame = false;
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
        viewGame.player.emit("get room list");
        viewGame.sound.play_BG("Play");
        viewGame.Game.wait.stop();
        viewGame.player.color = data.color;
        viewGame.player.oppname = data.oppname;
        viewGame.player.oppAvatar = data.avatar;
        viewGame.player.oppsex = data.sex;
        viewGame.player.oppGold = data.gold;
        viewGame.Game.Opp_name.show( viewGame.player.oppGold,viewGame.player.oppsex, viewGame.player.oppAvatar, viewGame.player.oppname);
        viewGame.Game.clock.restart();
    }
    onEndGame = (data: any) => {
        viewGame.sound.play_BG("Wait");
        this.FinishGame = true;
        viewGame.Game.clock.stop();
        viewGame.Game.broad.getChildAt(1).onStopMove(viewGame.Game.broad.getChildAt(1));
        let result1: PIXI.Sprite;
        let result2: PIXI.Sprite;
        if (data.result == 1) {
            setTimeout(() => {
                if (data.src > 10)
                    viewGame.sound.play_Voice("TRBT");
                else
                    viewGame.sound.play_Voice("ConGa");

            }, 2500);
            result1 = new PIXI.Sprite(Utils.Win);
            result2 = new PIXI.Sprite(Utils.Lose);
            result1.anchor.set(0.5);
            result1.scale.set(1.34);
            result2.anchor.set(0.5);
            result2.scale.set(1.3)
            result1.position.set(585, 447);
            result2.position.set(600, 188);
            viewGame.Game.addChild(result2);
            viewGame.Game.addChild(result1);
        }
        else if (data.result == 3) {
            setTimeout(() => {
                if (data.src > -10)
                    viewGame.sound.play_Voice("Hazz")
                else
                    viewGame.sound.play_Voice("Othua")
            }, 2500)
            result1 = new PIXI.Sprite(Utils.Lose);
            result2 = new PIXI.Sprite(Utils.Win)
            result1.anchor.set(0.5);
            result1.scale.set(1.3)
            result2.anchor.set(0.5);
            result2.scale.set(1.34)
            result1.position.set(600, 447);
            result2.position.set(585, 190);
            viewGame.Game.addChild(result2);
            viewGame.Game.addChild(result1);
        }
        else if (data.result == 2) {
            setTimeout(() => {
                viewGame.sound.play_Voice("Hoa")
            }, 2500)
            result1 = new PIXI.Sprite(Utils.Daw);
            result1.anchor.set(0.5);
            result1.scale.set(1.3);
            result1.position.set(600, 315);
            viewGame.Game.addChild(result1);
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