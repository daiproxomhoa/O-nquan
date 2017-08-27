"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class Room {
    constructor(id, name) {
        this.users = [];
        this.turnColor = true;
        this.player0accept = false;
        this.player1accept = false;
        this.key = "--/--";
        this.guest = "--/--";
        this.score = [0, 0];
        this.addUser = (user) => {
            if (this.users.length == 2)
                return false;
            this.users.push(user);
            user.idroom = this.id;
            user.isPlaying = true;
            user.idroom = this.id;
            user.socket.emit("join room success");
            if (this.users.length == 1) {
                this.key = user._username;
                this.users[0].emit("wait player");
                this.users[0].on("disconnect", () => {
                    this.onUser0Left(1);
                }, false);
                this.users[0].on("left room", () => {
                    this.onUser0Left(2);
                });
            }
            else if (this.users.length == 2) {
                this.turnColor = true;
                this.guest = user._username;
                this.users[0].emit("set turn", { gameturn: this.turnColor });
                this.users[1].emit("set turn", { gameturn: !this.turnColor });
                this.users[1].on("disconnect", () => {
                    this.onUser1Left(1);
                }, false);
                this.users[1].on("left room", () => {
                    this.onUser1Left(2);
                });
                this.startgame();
            }
        };
        this.startgame = () => {
            this.player0accept = false;
            this.player1accept = false;
            this.users[0].setCompatior(this.users[1]);
            this.users[1].setCompatior(this.users[0]);
            this.users[0].emit("start game", {
                gameturn: true,
                oppname: this.users[0].getCompatior().getUserName,
                avatar: this.users[0].getCompatior().avatarID,
                sex: this.users[0].getCompatior().sex
            });
            this.users[1].emit("start game", {
                gameturn: false,
                oppname: this.users[1].getCompatior().getUserName,
                avatar: this.users[1].getCompatior().avatarID,
                sex: this.users[1].getCompatior().sex
            });
            this.users[0].emit("score", { x: this.score[0], y: this.score[1] });
            this.users[1].emit("score", { x: this.score[1], y: this.score[0] });
            for (let i = 0; i < 2; i++) {
                this.users[i].on("move", (data) => {
                    if (!util_1.isNullOrUndefined(this.users[i])) {
                        if (!util_1.isNullOrUndefined(this.users[i].getCompatior()))
                            this.users[i].getCompatior().emit("opponent move", data);
                    }
                });
                this.users[i].on("change turn", () => {
                    if (!util_1.isNullOrUndefined(this.users[i])) {
                        if (!util_1.isNullOrUndefined(this.users[i].getCompatior())) {
                            this.turnColor = !this.turnColor;
                            this.users[i].getCompatior().emit("turn color", { turn: this.turnColor });
                            this.users[i].emit("turn color", { turn: this.turnColor });
                        }
                    }
                });
                this.users[i].on("end game", (data) => {
                    if (!util_1.isNullOrUndefined(this.users[i])) {
                        if (!util_1.isNullOrUndefined(this.users[i].getCompatior())) {
                            this.users[i].emit("game_end", data);
                            this.users[i].getCompatior().emit("game_end", { result: 4 - data.result, src: data.src, src1: data.src1 });
                            this.score[i] += data.src;
                            this.score[1 - i] += data.src1;
                            if (data.result != 3)
                                this.users[i].emit("restart");
                            else
                                this.users[i].getCompatior().emit("restart");
                            this.users[i].emit("score", { x: this.score[i], y: this.score[1 - i] });
                            this.users[i].getCompatior().emit("score", { x: this.score[1 - i], y: this.score[i] });
                        }
                    }
                });
                this.users[i].on("send message", (msg) => {
                    if (!util_1.isNullOrUndefined(this.users[i])) {
                        if (!util_1.isNullOrUndefined(this.users[i].getCompatior())) {
                            this.users[i].emit("new message", { playername: this.users[i].getUserName, message: msg });
                            this.users[i].getCompatior().emit("new message", {
                                playername: this.users[i].getUserName,
                                message: msg
                            });
                        }
                    }
                });
                this.users[i].on("Ready_continue", () => {
                    if (!util_1.isNullOrUndefined(this.users[i])) {
                        if (!util_1.isNullOrUndefined(this.users[i].getCompatior())) {
                            this.users[i].getCompatior().emit("continue_game");
                            if (i == 0) {
                                this.player0accept = true;
                            }
                            else {
                                this.player1accept = true;
                            }
                        }
                    }
                });
                this.users[i].on("accepted", (data) => {
                    if (!util_1.isNullOrUndefined(this.users[i])) {
                        if (!util_1.isNullOrUndefined(this.users[i].getCompatior())) {
                            if (data == true) {
                                if (i == 0) {
                                    this.player0accept = true;
                                }
                                else
                                    this.player1accept = true;
                                if (this.player0accept == this.player1accept) {
                                    console.log("OK");
                                    this.users[i].emit("Reset");
                                    this.users[i].getCompatior().emit("Reset");
                                    let second = this.users[i].getCompatior();
                                    let first = this.users[i];
                                    this.users = [];
                                    this.addUser(first);
                                    this.addUser(second);
                                }
                            }
                            else {
                                this.player0accept = false;
                                this.player1accept = false;
                            }
                        }
                    }
                });
            }
        };
        this.onUser0Left = (c) => {
            this.score = [0, 0];
            this.key = "--/--";
            this.guest = "--/--";
            if (this.users.length == 1) {
                this.users[0].setCompatior(null);
                if (c == 2)
                    this.users[0].isPlaying = false;
                if (c == 1)
                    this.users[0].isPlaying = null;
                this.users[0].idroom = null;
                this.users = [];
            }
            else if (this.users.length == 2) {
                this.users[0].setCompatior(null);
                this.users[1].setCompatior(null);
                if (c == 2) {
                    this.users[0].isPlaying = false;
                    this.users[1].isPlaying = false;
                }
                if (c == 1) {
                    this.users[0].isPlaying = null;
                    this.users[1].isPlaying = null;
                }
                this.users[0].idroom = null;
                let us = this.users[1];
                this.users = [];
                this.addUser(us);
                this.users[0].emit("user left");
            }
        };
        this.onUser1Left = (c) => {
            this.score = [0, 0];
            this.key = "--/--";
            this.guest = "--/--";
            if (this.users.length == 1) {
                this.users[0].setCompatior(null);
                if (c == 2)
                    this.users[0].isPlaying = false;
                if (c == 1)
                    this.users[0].isPlaying = null;
                this.users[0].idroom = null;
                this.users = [];
                this.key = "--/--";
            }
            else if (this.users.length == 2) {
                this.users[0].setCompatior(null);
                this.users[1].setCompatior(null);
                if (c == 2) {
                    this.users[0].isPlaying = false;
                    this.users[1].isPlaying = false;
                }
                if (c == 1) {
                    this.users[0].isPlaying = null;
                    this.users[1].isPlaying = null;
                }
                this.users[0].idroom = null;
                let us = this.users[0];
                this.users = [];
                this.addUser(us);
                this.users[0].emit("user left");
            }
        };
        this.isFull = () => {
            if (this.users.length >= 2) {
                return true;
            }
            return false;
        };
        this.id = id;
        this.name = name;
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map