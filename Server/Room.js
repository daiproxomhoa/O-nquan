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
                _this.users[0].emit("wait player");
                _this.users[0].on("disconnect", _this.onUser0Left);
                _this.users[0].on("left room", _this.onUser0Left);
            }
            else if (_this.users.length == 2) {
                _this.turnColor = true;
                _this.users[0].emit("set turn", { gameturn: _this.turnColor });
                _this.users[1].emit("set turn", { gameturn: !_this.turnColor });
                _this.users[1].on("disconnect", _this.onUser1Left);
                _this.users[1].on("left room", _this.onUser1Left);
                _this.startgame();
            }
        };
        this.startgame = function () {
            _this.player0accept = false;
            _this.player1accept = false;
            _this.users[0].emit("start game", { color: true, oppname: _this.users[1].getUserName });
            _this.users[1].emit("start game", { color: false, oppname: _this.users[0].getUserName });
            _this.users[0].setCompatior(_this.users[1]);
            _this.users[1].setCompatior(_this.users[0]);
            var _loop_1 = function (i) {
                _this.users[i].on("End turn", function () {
                    _this.users[i].emit("End_turn");
                });
                _this.users[i].on("move", function (data) {
                    _this.users[i].getCompatior().emit("opponent move", data);
                });
                _this.users[i].on("change turn", function () {
                    _this.turnColor = !_this.turnColor;
                    _this.users[i].getCompatior().emit("turn color", { turn: _this.turnColor });
                    _this.users[i].emit("turn color", { turn: _this.turnColor });
                });
                _this.users[i].on("end game", function (data) {
                    _this.users[i].emit("game_end", data);
                    _this.users[i].getCompatior().emit("game_end", { result: 4 - data.result, src: data.src });
                    if (data.result != 3)
                        _this.users[i].emit("restart");
                    else
                        _this.users[i].getCompatior().emit("restart");
                });
                _this.users[i].on("send message", function (msg) {
                    _this.users[i].emit("new message", { playername: _this.users[i].getUserName, message: msg });
                    _this.users[i].getCompatior().emit("new message", { playername: _this.users[i].getUserName, message: msg });
                });
                _this.users[i].on("Ready_continue", function () {
                    _this.users[i].getCompatior().emit("continue_game");
                    if (i == 0) {
                        _this.player0accept = true;
                    }
                    else {
                        _this.player1accept = true;
                    }
                });
                _this.users[i].on("accepted", function (data) {
                    if (data == true) {
                        if (i == 0) {
                            _this.player0accept = true;
                        }
                        else
                            _this.player1accept = true;
                        if (_this.player0accept == _this.player1accept) {
                            console.log("OK");
                            _this.users[i].emit("reload_last");
                            _this.users[i].getCompatior().emit("reload_first");
                            var first = _this.users[i].getCompatior();
                            var second = _this.users[i];
                            _this.users = [];
                            _this.addUser(first);
                            _this.addUser(second);
                        }
                    }
                    else {
                        _this.player0accept = false;
                        _this.player1accept = false;
                    }
                });
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
                var us = _this.users[1];
                _this.users = [];
                _this.addUser(us);
                _this.users[0].emit("user left");
            }
        };
        this.onUser1Left = function () {
            if (_this.users.length == 1) {
                _this.users = [];
            }
            else if (_this.users.length == 2) {
                var us = _this.users[0];
                _this.users = [];
                _this.addUser(us);
                _this.users[0].emit("user left");
            }
        };
        this.isFull = function () {
            if (_this.users.length >= 2) {
                return true;
            }
            return false;
        };
        this.isEmty = function () {
            if (_this.users.length == 0) {
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