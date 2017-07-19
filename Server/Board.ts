/**
 * Created by Administrator on 26/02/2017.
 */

import Socket = SocketIO.Socket;
import {User} from "./User";
// import {Queue} from "./Queue";

export class Room {

    name: string;
    users = [];
    turnColor = true;
    player0accept = false;
    player1accept = false;
    id: number;
    stake: number = 0;

    constructor(id, name: string) {
        this.id = id;
        this.name = name;
    }

    addUser = (user: User) => {
        if (this.users.length == 2) return false;
        this.users.push(user);
        user.socket.emit("join room success");
        user.socket.once("room status", () => {
            if (this.users.length == 1) {
                this.users[0].socket.emit("wait player");
                this.users[0].on("disconnect", this.onUser0Left);
                this.users[0].on("left room", this.onUser0Left);
            } else if (this.users.length == 2) {
                this.users[1].on("disconnect", this.onUser1Left);
                this.users[1].on("left room", this.onUser1Left);
                this.startgame();
            }
        });

        return true;
    };

    onUser0Left = () => {
        if (this.users.length == 1) {
            this.users = [];
        } else if (this.users.length == 2) {
            this.users.splice(0, 1);
            this.users[0].socket.emit("user left");
        }
    }
    onUser1Left = () => {
        if (this.users.length == 1) {
            this.users = [];
        } else if (this.users.length == 2) {
            this.users.splice(1, 1);
            this.users[0].socket.emit("user left");
        }
    };

    startgame = () => {
        this.player0accept = false;
        this.player1accept = false;
        this.turnColor = true;
        this.users[0].socket.emit("start game", {color: true, oppname: this.users[1].username});
        this.users[1].socket.emit("start game", {color: false, oppname: this.users[0].username});
        for (let i = 0; i < 2; i++) {

            this.users[i].on("move", (data: any) => {
                this.users[1 - i].socket.emit("opponent move", data);
                this.turnColor = !this.turnColor;
                this.users[0].socket.emit("turn color", this.turnColor);
                this.users[1].socket.emit("turn color", this.turnColor);
            });

            this.users[i].on("promotion", (data: any) => {
                this.users[1 - i].socket.emit("opponent promotion", data);
                this.turnColor = !this.turnColor;
                this.users[0].socket.emit("turn color", this.turnColor);
                this.users[1].socket.emit("turn color", this.turnColor);
            });

            this.users[i].on("restart", () => {
                if (i == 0) this.player0accept = true;
                else this.player1accept = true;
                if (this.player1accept && this.player0accept) {
                    this.users[0].socket.emit("restart game");
                    this.users[1].socket.emit("restart game");
                }
            });
            this.users[i].on("game finish", () => {
                this.users[1 - i].socket.emit("finish");
            });

            this.users[i].on("left", () => {
                this.users[1 - i].socket.emit("player left");
                this.users.splice(i, 1);
            })
            this.users[i].on("send message", (msg: string) => {
                this.users[i].socket.emit("new message", {playername: this.users[i].username, message: msg});
                this.users[1 - i].socket.emit("new message", {playername: this.users[i].username, message: msg});
            });
            this.users[i].on("time out", () => {
                this.users[1 - i].socket.emit("opponent timeout");
            });
        }
    }

    isFull = () => {
        if (this.users.length >= 2) {
            return true;
        }
        return false;
    }

}