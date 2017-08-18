import * as PIXI from "pixi.js"
import {Square} from "../ObjectGame/SquareContainer";
import * as gsap from "gsap"
import Container = PIXI.Container;
import {Box} from "../ObjectGame/BoxContainer";
import Sprite = PIXI.Sprite;
import {Utils} from "../Utils";
import {clock} from  "../ObjectGame/Clock";
import TweenMax = gsap.TweenMax;
import {App} from "../Const/App";
import {Button} from "../IU/Button";
import {Player} from "../Player";
import {Panel} from "../IU/Panel";
import {Wait} from "../ObjectGame/Wait";
import {NamePlayer} from "../ObjectGame/NamePlayer";
import {Chat} from "./Chat";
import {viewGame} from "./viewGame";
import {Invite} from "../IU/Invite";
export class Game extends Container {
    // gametable = [7 , 1, 0, 0, 0, 0, 7, 0, 0,0 , 1, 0, 7, 7];
    private gametable = [1, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5, 0, 0];
    private broad_main;
    broad;
    flag;
    clock;
    public static clock;
    private FinishGame = false;
    static endgame = false;
    resetGame: Button;
    leftGame: Button;
    Setting: Button;
    Invite: Button
    player: Player;
    wait: Wait;
    My_name: NamePlayer;
    Opp_name: NamePlayer;
    chat_board: Chat;


    constructor(player: Player) {
        super();
        this.player = player;
        this.createBroadGame();
        this.createIU();
        this.createClock();
        this.createFlag();
    }

    reloadGame = () => {
        Game.endgame = false;
        this.clock.stop();
        this.removeChildren();
        this.createBroadGame();
        this.createIU();
        this.createClock();
        this.createFlag();
    }
    reloadGame2 = () => {
        Game.endgame = false;
        this.clock.stop();
        let chat = this.chat_board;
        this.removeChildren();
        this.createBroadGame2();
        this.addChild(chat);
        this.createIU();
        this.createClock();
        this.createFlag();
    }
    createBroadGame = () => {
        var background = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/background.png');
        background.width = 1200;
        background.height = 640;
        this.addChild(background);
        this.createChat();
        this.createBroad(this.gametable);
    }
    createBroadGame2 = () => {
        var background = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/background.png');
        background.width = 1200;
        background.height = 640;
        this.addChild(background);
        this.createBroad(this.gametable);

    }
    createFlag = () => {
        this.flag = new PIXI.Sprite(Utils.Flag);
        this.flag.scale.set(0.65);
        this.addChild(this.flag);
    }
    createClock = () => {
        this.clock = new clock();
        this.clock.position.set(70, 205);
        this.addChild(this.clock);
    }
    createChat = () => {
        this.chat_board = new Chat();
        this.addChild(this.chat_board);
    }
    createIU = () => {
        this.resetGame = new Button(1125, 115, "", App.AssetDir + "Picture/IU/refreshbtn.png")
        this.resetGame.setSize(new PIXI.Point(120, 65));
        this.resetGame.onClick = () => {
            if (this.wait.visible == false) {
                this.player.emit("Ready_continue");
                Panel.showDialog("Đợi đối phương trả lời");
            }
            else {
                Panel.showDialog("Không có ai trong phòng !");
            }
        };
        this.leftGame = new Button(1125, 45, "", App.AssetDir + "Picture/IU/outroom.png");
        this.leftGame.setSize(new PIXI.Point(120, 60));
        this.leftGame.onClick = () => {
            Panel.showConfirmDialog("Bạn muốn thoát chứ ?", {
                text: "Có",
                action: () => {
                    this.reloadGame();
                    this.onWait();
                    this.broad.getChildAt(1).onStopMove(this.broad.getChildAt(1));
                    this.player.emit("left room");
                    viewGame.Game.visible = false;
                    viewGame.Hall.visible = true;

                }
            }, {
                text: "Không",
                action: () => {
                }
            });
        }
        this.Setting = new Button(1125, 255, "", App.AssetDir + "Picture/IU/setting.png");
        this.Setting.setSize(new PIXI.Point(117, 60));
        this.Setting.onClick = () => {
            viewGame.Setting.show();
        }
        this.Invite = new Button(1125, 185, "", App.AssetDir + "Picture/IU/invite.png");
        this.Invite.setSize(new PIXI.Point(117, 60));
        this.Invite.onClick = () => {
            viewGame.Invite.show();
        }
        this.wait = new Wait();
        this.wait.scale.set(0.7);
        this.wait.stop();
        this.wait.position.set(245, 165);
        this.My_name = new NamePlayer("" + this.player.username);
        this.My_name.position.set(505, 450);
        this.addChild(this.My_name);
        this.Opp_name = new NamePlayer("" + this.player.oppname);
        this.Opp_name.position.set(505, 0);
        this.addChild(this.resetGame, this.leftGame, this.Setting, this.Invite, this.wait, this.My_name, this.Opp_name);
    }
    onWait = () => {
        this.player.oppname = "";
        this.Opp_name.setName("" + this.player.oppname);
        viewGame.sound.play_BG("Wait");
        this.broad.getChildAt(1).onStopMove(this.broad.getChildAt(1));
        this.wait.run();
        ;
        TweenMax.to(this.flag, 0.5, {x: 700, y: 460});

    }

    createBroad(table) {
        this.broad_main = new PIXI.Container();
        this.broad = new PIXI.Container();
        let container = new Container();
        let b;

        for (let i = 0; i < table.length - 2; i++) {
            let square;
            let box;
            if (i == 0) {
                box = new Box(table[i] + 9, 0);
                // box.height = 157;
                square = new Square(table[i], 1, 0, this);
                box.position.set(102, 73);
                square.position.set(102, 73);

            }
            else if (i == 6) {
                box = new Box(table[i] + 9, 6);
                // box.height = 157;
                square = new Square(table[i], 2, 6, this);
                box.position.set(575, 73);
                square.position.set(575, 73)
            } else {
                if (i > 0 && i < 6)
                    square = new Square(table[i], 0, i, this);
                else
                    square = new Square(table[i], 0, i, this);
                box = new Box(table[i]);
                let a = (112 + 77 * i) - Math.floor(i / 6) * ((112 + 77 * i) - 574 + (i - 6) * 77);
                let b = 150 - 77 * Math.floor(i / 6);
                box.position.set(a, b);
                square.position.set(a, b);
            }
            square.setPos(square.x, square.y);
            this.broad.addChild(square);
            container.addChild(box);

        }
        let home1 = new Square(table[12], 0, 12, this);
        home1.position.set(355, 318);
        home1.setPos(home1.x, home1.y);
        let home2 = new Square(table[13], 0, 13, this);
        home2.position.set(355, -100);
        home2.setPos(home1.x, home1.y);
        let spread = new Square(0, 0, 14, this);
        spread.position.set(10, 10);
        spread.setPos(10, 10);
        this.broad.addChild(home1, home2, spread);
        let h1 = new Box(0, 1);
        h1.position.set(300, 305);
        let h2 = new Box(0, 1);
        h2.position.set(300, -105);
        container.addChild(h1, h2);
        this.broad_main.addChild(this.broad);
        this.broad_main.addChild(container);
        this.broad_main.position.set(158, 150)
        this.broad_main.scale.set(1.1);
        this.addChild(this.broad_main);
    }
}
