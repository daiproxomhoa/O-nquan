"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Administrator on 25/02/2017.
 */
var express = require("express");
var http = require("http");
var SocketIO = require("socket.io");
var Main = (function () {
    function Main() {
        var _this = this;
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = SocketIO(this.server);
        this.port = process.env.PORT || 3000;
        this.users = [];
        this.onConnect = function (socket) {
            // this.users.push(new User(socket));
            console.log("New User connect!");
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
new Main(); /**
 * Created by Vu Tien Dai on 05/07/2017.
 */
//# sourceMappingURL=Main.js.map