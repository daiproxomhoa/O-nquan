"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Administrator on 25/02/2017.
 */
var User = (function () {
    function User(socket) {
        var _this = this;
        this.socket = socket;
        this.connect = false;
        this.onUserDisconnect = function () {
            _this.socket.broadcast.emit("user left", _this.userName);
        };
        this.onAddUser = function (userName) {
            if (_this.connect)
                return;
            _this.userName = userName;
            _this.connect = true;
            User.numUsers++;
            _this.socket.broadcast.emit("user joined", { username: _this.userName, message: " joined the room!" });
        };
        this.onNewMessage = function (msg) {
            _this.socket.emit("new message", {
                username: _this.userName,
                message: msg
            });
            _this.socket.broadcast.emit("new message", {
                username: _this.userName,
                message: msg
            });
        };
        socket.on("add user", this.onAddUser);
        socket.on("new message", this.onNewMessage);
        socket.on("disconnect", this.onUserDisconnect);
    }
    return User;
}()); /**
 * Created by Vu Tien Dai on 05/07/2017.
 */
User.numUsers = 0;
exports.User = User;
//# sourceMappingURL=User.js.map