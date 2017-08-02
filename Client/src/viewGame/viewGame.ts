/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
import * as PIXI from "pixi.js"
import * as gsap from "gsap"
import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import {Player} from "../Player";
import {Utils} from "../Utils";
import {ScrollPane} from "../IU/ScollPane";
import TweenMax = gsap.TweenMax;
import {Game} from "./Game";
import {Login} from "./LoginView";
import {Chat} from "./Chat";
import {Button} from "../IU/Button";
export class viewGame {
    app = new PIXI.Application(1200, 640, {backgroundColor: 0x1099bb});
    private wait;
    static turn = true;
    static game_turn;
    public static player: Player;
    private FinishGame = false;
    resetGame: Button;
    game_broad: Game;
    login_broad: Login;
    chat_board: Chat;
    result: PIXI.Sprite;
    last_turn;
    Game;


    constructor() {
        viewGame.player = new Player(this);
        document.body.appendChild(this.app.view);
        this.eventPlayer();
        this.createGame();
        this.createLogin();
    }

    createLogin = () => {
        this.login_broad = new Login();
        this.wait = PIXI.Sprite.fromImage('../Picture/wait.png');
        this.app.stage.addChild(this.login_broad);
    }
    createGame = () => {
        this.Game = new PIXI.Container();
        this.game_broad = new Game();
        this.chat_board = new Chat();
        this.resetGame = new Button(1110, 50, "", "../Picture/IU/refreshbtn.png")
        this.resetGame.scale.set(0.75);
        this.resetGame.visible = false;
        this.resetGame.onClick = () => {
            viewGame.player.emit("reload",viewGame.game_turn);
            viewGame.turn=viewGame.game_turn;
            this.game_broad.reloadGame();
            TweenMax.to(this.game_broad.flag, 0.5, {x: 700, y: 460});
            this.resetGame.visible = false;

        };
        this.Game.addChild(this.game_broad, this.chat_board, this.resetGame);
        this.app.stage.addChild(this.Game);
    }

    eventPlayer = () => {
        viewGame.player.on("start game", this.onStartGame);
        viewGame.player.on("turn color", this.onTurnColor);
        viewGame.player.on("set turn", this.onSetTurn);
        viewGame.player.on("opponent move", this.onMove);
        viewGame.player.on("game_end", this.onEndGame);
        viewGame.player.on("wait player", this.onWait);
        viewGame.player.on("new message", (data: any) => {
            this.chat_board.messageBox.addChildrent(new PIXI.Text(data.playername + " : " + data.message));
        });
        viewGame.player.on("End_turn", this.onAutoEndturn);
        viewGame.player.on("restart", this.onRestart);
        viewGame.player.on("reload game", this.onReLoad);
    }
    onRestart = () => {
        if (this.last_turn == true) {
            this.resetGame.visible = true;
            this.FinishGame = false;
        }
    }
    onReLoad = (data:any) => {
        this.game_broad.reloadGame();
        console.log(viewGame.turn+" "+viewGame.game_turn);
        viewGame.turn=data;
        this.game_broad.broad.getChildAt(1).onStopMove(this.game_broad.broad.getChildAt(1));
        this.FinishGame = false;
        TweenMax.to(this.game_broad.flag, 0.5, {x: 370, y: 90})
    }
    onAutoEndturn = () => {
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
                    viewGame.player.emit("move", {posi: i + 6, dr: bool});
                    if (bool == false)
                        this.game_broad.broad.getChildAt(i).onMoveRight(this.game_broad.broad.getChildAt(i))
                    else
                        this.game_broad.broad.getChildAt(i).onMoveLeft(this.game_broad.broad.getChildAt(i))
                    return;
                }
            }
        }

    }
    onStartGame = (data: any) => {
        this.wait.visible = false;
        viewGame.player.color = data.color;
        viewGame.player.oppname = data.oppname;
        this.game_broad.clock.restart();
    }
    onWait = () => {
        this.game_broad.broad.getChildAt(1).onStopMove(this.game_broad.broad.getChildAt(1));
        this.wait.position.set(330, 164);
        this.wait.scale.set(0.7);
        this.game_broad.addChild(this.wait);
    }
    onEndGame = (data: any) => {
        console.log("End game :" + data.result);
        this.FinishGame = true;
        this.game_broad.clock.stop();
        this.game_broad.broad.getChildAt(1).onStopMove(this.game_broad.broad.getChildAt(1));
        if (data.result == 1) {
            this.result = new PIXI.Sprite(Utils.Win);
            this.result.position.set(520, 395);
            this.game_broad.addChild(this.result);
            this.last_turn = true;
        }
        else if (data.result == 3) {
            this.result = new PIXI.Sprite(Utils.Lose);
            this.result.position.set(520, 395);
            this.game_broad.addChild(this.result);
            this.last_turn = false;
        }
        else if (data.result == 2) {
            if (this.last_turn != false)
                this.last_turn = true
            this.result = new PIXI.Sprite(Utils.Daw);
            this.result.position.set(520, 395);
            this.game_broad.addChild(this.result);

        }
    }
    onSetTurn = (data: any) => {
        viewGame.game_turn = data;
        this.last_turn = data;
        if (viewGame.game_turn == true) {
            this.game_broad.broad.getChildAt(1).onStartMove(this.game_broad.broad.getChildAt(1));
            TweenMax.to(this.game_broad.flag, 0.5, {x: 700, y: 460})

        }
        else {
            this.game_broad.broad.getChildAt(1).onStopMove(this.game_broad.broad.getChildAt(1));
            TweenMax.to(this.game_broad.flag, 0.5, {x: 370, y: 90})
        }
    }
    onTurnColor = (data: any) => {
        viewGame.turn = data;
        this.game_broad.clock.restart();
        if (viewGame.turn == viewGame.game_turn) {
            this.game_broad.broad.getChildAt(1).onStartMove(this.game_broad.broad.getChildAt(1));
            TweenMax.to(this.game_broad.flag, 0.5, {x: 700, y: 460})
        }
        else {
            this.game_broad.broad.getChildAt(1).onStopMove(this.game_broad.broad.getChildAt(1));
            TweenMax.to(this.game_broad.flag, 0.5, {x: 370, y: 90})
        }

    }
    onMove = (data: any) => {
        this.game_broad.clock.stop();
        if (data.dr == false) {
            this.game_broad.broad.getChildAt(data.posi).onMoveRight(this.game_broad.broad.getChildAt(data.posi));
        }
        else {
            this.game_broad.broad.getChildAt(data.posi).onMoveLeft(this.game_broad.broad.getChildAt(data.posi));
        }
    }

}
// export let viewGame = new viewGame();