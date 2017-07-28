/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
import * as PIXI from "pixi.js"
import {Square} from "../ObjectGame/SquareContainer";
import * as gsap from "gsap"
import Container = PIXI.Container;
import {Box} from "../ObjectGame/BoxContainer";
import Sprite = PIXI.Sprite;
import {Player} from "../Player";
import {Utils} from "../Utils";
import {TextField} from "../IU/TextField";
import {Button} from "../IU/Button";
import {ScrollPane} from "../IU/ScollPane";
import {clock} from  "../ObjectGame/Clock";
import TweenMax = gsap.TweenMax;
export class viewGame {
    app = new PIXI.Application(1200, 640, {backgroundColor: 0x1099bb});
    gametable = [7, 5, 5, 1, 0, 0, 7, 5, 5, 1, 0, 0, 7, 7];
    // gametable = [1,5,5,5,5,5,1,5,5,5,5,5, 0,0];
    field = new PIXI.Container();
    private broad_main;
    private broad;
    private chatboard;
    private login;
    private wait;
    static turn = true ;
    static game_turn;
    public static player: Player;
    private messageBox: ScrollPane;
    public static clock;
    private flag;
    private FinishGame =false;

    constructor() {
        viewGame.player = new Player(this);
        this.eventPlayer();
        this.createViewGame();
        this.createLogin();
        this.createClock();
        this.createFlag();
    }

    createFlag = () => {
        this.flag = new PIXI.Sprite(Utils.Flag);
        this.flag.scale.set(0.65);
        this.field.addChild(this.flag);
    }
    createClock = () => {
        viewGame.clock = new clock();
        viewGame.clock.position.set(70, 205);
        this.field.addChild(viewGame.clock);
    }
    eventPlayer = () => {
        viewGame.player.on("start game", this.onStartGame);
        viewGame.player.on("turn color", this.onTurnColor);
        viewGame.player.on("set turn", this.onSetTurn);
        viewGame.player.on("opponent move", this.onMove);
        viewGame.player.on("game_end", this.onEndGame);
        viewGame.player.on("wait player", this.onWait);
        viewGame.player.on("new message", (data: any) => {
            this.messageBox.addChildrent(new PIXI.Text(data.playername + " : " + data.message));
        });
       // viewGame.player.on("End_turn",this.onAutoEndturn);
    }
    onAutoEndturn=()=>{
        if(this.FinishGame==false){
        let bool ;
        let rd = Math.round(Math.random());
        if(rd==1)
            bool=true;
        else
            bool=false;
        let Square = this.broad.children;
        for(let i=1;i<6 ;i++){
            if(Square[i].children.length!=0){
                viewGame.player.emit("move", {posi: i + 6, dr: bool});
                if(bool==false)
                    this.broad.getChildAt(i).onMoveRight(this.broad.getChildAt(i))
                else
                    this.broad.getChildAt(i).onMoveLeft(this.broad.getChildAt(i))
                return;
            }
        }}

    }
    onStartGame = (data: any) => {
        this.wait.visible=false;
        viewGame.player.color = data.color;
        viewGame.player.oppname = data.oppname;
        viewGame.clock.restart();
    }
    onWait = () => {
        this.broad.getChildAt(1).onStopMove(this.broad.getChildAt(1));
        this.wait.position.set(330, 164);
        this.wait.scale.set(0.7);
        this.field.addChild(this.wait);
    }
    onEndGame = (data: any) => {
        console.log("End game :" + data.result);
        this.FinishGame=true;
        this.broad.getChildAt(1).onStopMove(this.broad.getChildAt(1));
        if (data.result == 1) {
            let win = new PIXI.Sprite(Utils.Win);
            win.position.set(520, 395);
            this.field.addChild(win);

        }
        else if (data.result == 3) {
            let win = new PIXI.Sprite(Utils.Lose);
            win.position.set(520, 395);
            this.field.addChild(win);

        }
        else if (data.result == 2) {
            let win = new PIXI.Sprite(Utils.Daw);
            win.position.set(520, 395);
            this.field.addChild(win);

        }
    }
    onSetTurn = (data: any) => {
        viewGame.game_turn = data;
        if (viewGame.game_turn == true) {
            this.broad.getChildAt(1).onStartMove(this.broad.getChildAt(1));
            TweenMax.to(this.flag, 0.5, {x: 700, y: 460})

        }
        else {
            this.broad.getChildAt(1).onStopMove(this.broad.getChildAt(1));
            TweenMax.to(this.flag, 0.5, {x: 370, y: 90})
        }
    }
    onTurnColor = (data: any) => {
        viewGame.turn = data;
        console.log(data);
        viewGame.clock.restart();
        if (viewGame.turn == viewGame.game_turn) {
            this.broad.getChildAt(1).onStartMove(this.broad.getChildAt(1));
            TweenMax.to(this.flag, 0.5, {x: 700, y: 460})
        }
        else {
            this.broad.getChildAt(1).onStopMove(this.broad.getChildAt(1));
            TweenMax.to(this.flag, 0.5, {x: 370, y: 90})
        }

    }

    onMove = (data: any) => {
        viewGame.clock.stop();
        if (data.dr == false) {
            this.broad.getChildAt(data.posi).onMoveRight(this.broad.getChildAt(data.posi));
        }
        else {
            this.broad.getChildAt(data.posi).onMoveLeft(this.broad.getChildAt(data.posi));
        }
    }

    createViewGame() {
        document.body.appendChild(this.app.view);
        var background = PIXI.Sprite.fromImage('../Picture/background.png');
        background.width = this.app.renderer.width;
        background.height = this.app.renderer.height;
        background.width = 1200;
        background.height = 640;
        this.field.addChild(background);
        this.app.stage.addChild(this.field);
        this.createBroad(this.gametable);

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
                square = new Square(table[i], 1, 0);
                box.position.set(102, 73);
                square.position.set(102, 73);

            }
            else if (i == 6) {
                box = new Box(table[i] + 9, 6);
                // box.height = 157;
                square = new Square(table[i], 2, 6);
                box.position.set(575, 73);
                square.position.set(575, 73)
            } else {
                if (i > 0 && i < 6)
                    square = new Square(table[i], 0, i);
                else
                    square = new Square(table[i], 0, i);
                box = new Box(table[i]);
                let a = (112 + 77 * i) - Math.floor(i / 6) * ((112 + 77 * i) - 574 + (i - 6) * 77);
                let b = 150 - 77 * Math.floor(i / 6);
                box.position.set(a, b);
                square.position.set(a, b);
            }
            this.broad.addChild(square);
            container.addChild(box);

        }
        let home1 = new Square(table[12], 0, 12);
        home1.position.set(355, 318);
        let home2 = new Square(table[13], 0, 13);
        home2.position.set(355, -100);
        let spread = new Square(0, 0, 14);
        spread.position.set(10, 10);
        this.broad.addChild(home1, home2, spread);
        let h1 = new Box(0, 1);
        h1.position.set(300, 305);
        let h2 = new Box(0, 1);
        h2.position.set(300, -105);
        container.addChild(h1, h2);
        this.broad_main.addChild(this.broad);
        this.broad_main.addChild(container);
        this.broad_main.position.set(200, 158);
        this.field.addChild(this.broad_main);
        // this.field.scale.set(1);
        this.createChat();
        // this.field.scale.set(1)
    }

    createChat() {
        this.chatboard = new PIXI.Container();
        this.chatboard.position.set(900, 0)
        this.field.addChild(this.chatboard);
        this.messageBox = new ScrollPane(270, 300);
        this.messageBox.x = 10;
        this.messageBox.y = 280;
        let txtMessage = new TextField(10, 610);
        txtMessage.scale.set(0.3);
        let sendBtn = new Button(258, 610, "", "../Picture/IU/sendmsg.png");
        sendBtn.setSize(new PIXI.Point(40, 30));
        sendBtn.onClick = () => {
            if (txtMessage.getText() != "") {
                viewGame.player.emit("send message", txtMessage.getText());
                txtMessage.setText("");
            }
        };
        this.chatboard.addChild(this.messageBox, txtMessage, sendBtn);
    }

    createLogin = () => {
        this.login = new PIXI.Container();
        let backgroud = PIXI.Sprite.fromImage('../Picture/Login.png');
        backgroud.width = 1200;
        backgroud.height = 640;
        this.app.stage.addChild(this.login);
        let txtMessage = new TextField(145, 400);
        txtMessage.setText('User name ');
        txtMessage.scale.set(0.4);
        let Loginbtn = new Button(510, 400, "", "../Picture/IU/loginbtn.png");
        Loginbtn.setSize(new PIXI.Point(100, 50));
        Loginbtn.onClick = () => {
            if (txtMessage.getText() != "") {
                viewGame.player.emit("login", txtMessage.getText());
                txtMessage.setText("");
                this.login.alpha = 0;
                this.login.position.set(-1000);
            }
        };
        this.login.addChild(backgroud, txtMessage, Loginbtn)
        this.wait = PIXI.Sprite.fromImage('../Picture/wait.png');
    }
}
// export let viewGame = new viewGame();