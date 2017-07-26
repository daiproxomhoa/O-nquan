"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Administrator on 25/02/2017.
 */
var express = require("express");
var http = require("http");
var SocketIO = require("socket.io");
var User_1 = require("./User");
var Room_1 = require("./Room");
var Main = (function () {
    function Main() {
        var _this = this;
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = SocketIO(this.server);
        this.count = 0;
        this.port = process.env.PORT || 3000;
        this.Rooms = [];
        this.onConnect = function (socket) {
            _this.count++;
            socket.on("login", function (username) {
                if (_this.room == null) {
                    console.log("first");
                    _this.room = new Room_1.Room(_this.count, "room" + _this.count);
                    _this.room.addUser(new User_1.User(username.toString(), socket));
                }
                else if (_this.room.isFull() == true) {
                    _this.Rooms.push(_this.room);
                    _this.room = new Room_1.Room(_this.count, "room" + _this.count);
                    _this.room.addUser(new User_1.User(username.toString(), socket));
                    console.log("Nguoi 1 zo");
                }
                else {
                    _this.room.addUser(new User_1.User(username.toString(), socket));
                    console.log("Nguoi 2 zo");
                }
            });
        };
        this.onListen = function () {
            console.log('Server listening at port ' + _this.port);
        };
        this.app.use(express.static(__dirname + '/../dist'));
        ;
        this.server.listen(this.port, this.onListen);
        this.io.on('connection', this.onConnect);
    }
    return Main;
}());
new Main();
/**
 * Created by Vu Tien Dai on 05/07/2017.
 */
//# sourceMappingURL=Main.js.map