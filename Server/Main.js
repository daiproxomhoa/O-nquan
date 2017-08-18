"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Administrator on 25/02/2017.
 */
const express = require("express");
const http = require("http");
const SocketIO = require("socket.io");
const User_1 = require("./User");
const Manages_1 = require("./Manages");
class Main {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = SocketIO(this.server);
        this.count = 0;
        this.port = process.env.PORT || 3000;
        this.Rooms = [];
        this.onConnect = (socket) => {
            this.count++;
            socket.on("login", (username) => {
                this.manages.addUser(new User_1.User(username.toString(), socket));
            });
        };
        this.onListen = () => {
            console.log('Server listening at port ' + this.port);
        };
        this.app.use(express.static(__dirname + '/../dist'));
        this.server.listen(this.port, this.onListen);
        this.io.on('connection', this.onConnect);
        this.manages = new Manages_1.Manages();
    }
}
new Main();
/**
 * Created by Vu Tien Dai on 05/07/2017.
 */
//# sourceMappingURL=Main.js.map