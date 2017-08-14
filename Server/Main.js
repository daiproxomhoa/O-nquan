"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Administrator on 25/02/2017.
 */
var express = require("express");
var http = require("http");
var SocketIO = require("socket.io");
var User_1 = require("./User");
var Manages_1 = require("./Manages");
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
                // if(this.room ==null){
                //     console.log("first");
                //     this.room = new Room(this.count, "room" + this.count);
                //     this.room.addUser(new User(username.toString(),socket));
                // }
                // else if (this.room.isFull() == true) {
                //     this.Rooms.push(this.room);
                //     this.room = new Room(this.count, "room" + this.count);
                //     this.room.addUser(new User(username.toString(), socket));
                //     console.log("Nguoi 1 zo")
                // }
                //
                // else {
                //     this.room.addUser(new User(username.toString(),socket));
                // }
                _this.manages.addUser(new User_1.User(username.toString(), socket));
            });
        };
        this.onListen = function () {
            console.log('Server listening at port ' + _this.port);
        };
        this.app.use(express.static(__dirname + '/../dist'));
        this.server.listen(this.port, this.onListen);
        this.io.on('connection', this.onConnect);
        this.manages = new Manages_1.Manages();
    }
    return Main;
}());
new Main();
/**
 * Created by Vu Tien Dai on 05/07/2017.
 */
//# sourceMappingURL=Main.js.map