"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Room = (function () {
    function Room(id, name) {
        var _this = this;
        this.users = [];
        this.turnColor = true;
        this.player0accept = false;
        this.player1accept = false;
        this.addUser = function (user) {
            if (_this.users.length == 2)
                return false;
            _this.users.push(user);
            user.socket.emit("join room success");
            if (_this.users.length == 1) {
                _this.users[0].socket.emit("wait player");
                // console.log(this.turnColor);
                // this.users[0].on("disconnect", this.onUser0Left);
                // this.users[0].on("left room", this.onUser0Left);
            }
            else if (_this.users.length == 2) {
                _this.users[0].socket.emit("set turn", _this.turnColor);
                _this.users[1].socket.emit("set turn", !_this.turnColor);
                // this.users[1].on("disconnect", this.onUser1Left);
                // this.users[1].on("left room", this.onUser1Left);
                _this.startgame();
            }
            // console.log(this.users.length);
        };
        this.startgame = function () {
            _this.player0accept = false;
            _this.player1accept = false;
            _this.turnColor = true;
            _this.users[0].socket.emit("start game", { color: true, oppname: _this.users[1].getUserName });
            _this.users[1].socket.emit("start game", { color: false, oppname: _this.users[0].getUserName });
            var _loop_1 = function (i) {
                _this.users[i].on("End turn", function () {
                    _this.users[i].socket.emit("End_turn");
                });
                _this.users[i].on("move", function (data) {
                    _this.users[1 - i].socket.emit("opponent move", data);
                });
                _this.users[i].socket.on("change turn", function () {
                    ;
                    _this.turnColor = !_this.turnColor;
                    console.log(_this.turnColor);
                    _this.users[1 - i].socket.emit("turn color", _this.turnColor);
                    _this.users[i].socket.emit("turn color", _this.turnColor);
                });
                _this.users[i].on("end game", function (data) {
                    _this.users[1 - i].socket.emit("game_end", { team: data.team, result: 4 - data.result });
                });
                _this.users[i].on("send message", function (msg) {
                    _this.users[i].socket.emit("new message", { playername: _this.users[i].getUserName, message: msg });
                    _this.users[1 - i].socket.emit("new message", { playername: _this.users[i].getUserName, message: msg });
                });
                // this.users[i].on("restart", () => {
                //     if (i == 0) this.player0accept = true;
                //     else this.player1accept = true;
                //     if (this.player1accept && this.player0accept) {
                //         this.users[0].socket.emit("restart game");
                //         this.users[1].socket.emit("restart game");
                //     }
                // });
                // this.users[i].on("game finish", () => {
                //     this.users[1 - i].socket.emit("finish");
                // });
                //
                // this.users[i].on("left", () => {
                //     this.users[1 - i].socket.emit("player left");
                //     this.users.splice(i, 1);
                // })
                // this.users[i].on("send message", (msg: string) => {
                //     this.users[i].socket.emit("new message", {playername: this.users[i].username, message: msg});
                //     this.users[1 - i].socket.emit("new message", {playername: this.users[i].username, message: msg});
                // });
                // this.users[i].on("time out", () => {
                //     this.users[1 - i].socket.emit("opponent timeout");
                // });
            };
            for (var i = 0; i < 2; i++) {
                _loop_1(i);
            }
        };
        this.onUser0Left = function () {
            if (_this.users.length == 1) {
                _this.users = [];
            }
            else if (_this.users.length == 2) {
                _this.users.splice(0, 1);
                _this.users[0].socket.emit("user left");
            }
        };
        this.onUser1Left = function () {
            if (_this.users.length == 1) {
                _this.users = [];
            }
            else if (_this.users.length == 2) {
                _this.users.splice(1, 1);
                _this.users[0].socket.emit("user left");
            }
        };
        this.isFull = function () {
            if (_this.users.length >= 2) {
                return true;
            }
            return false;
        };
        this.id = id;
        this.name = name;
    }
    return Room;
}());
exports.Room = Room;
//# sourceMappingURL=Room.js.map