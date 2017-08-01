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
    // gametable = [0 , 5, 0, 0, 1, 0, 7, 5, 5, 1, 0, 1, 7, 7];
    private gametable = [1, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5, 0, 0];
    private wait;
    static turn = true;
    static game_turn;
    public static player: Player;
    private FinishGame = false;
    resetGame: Button;
    game_broad: Game;
    login_broad: Login;
    chat_board: Chat;
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
        this.resetGame.onClick = () => {
            // this.Game.removeChildAt(0);
            // this.game_broad = new Game();
            // this.Game.addChildAt(0,this.game_broad);
            // console.log("nhu cc");
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
            let win = new PIXI.Sprite(Utils.Win);
            win.position.set(520, 395);
            this.game_broad.addChild(win);

        }
        else if (data.result == 3) {
            let win = new PIXI.Sprite(Utils.Lose);
            win.position.set(520, 395);
            this.game_broad.addChild(win);

        }
        else if (data.result == 2) {
            let win = new PIXI.Sprite(Utils.Daw);
            win.position.set(520, 395);
            this.game_broad.addChild(win);

        }
    }
    onSetTurn = (data: any) => {
        viewGame.game_turn = data;
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
        console.log(data);
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