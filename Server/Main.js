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
const util_1 = require("util");
class Main {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = SocketIO(this.server);
        this.count = 0;
        this.port = process.env.PORT || 3000;
        this.onConnect = (socket) => {
            this.count++;
            socket.on("login", (data) => {
                if (!util_1.isNullOrUndefined(data)) {
                    this.query("SELECT * FROM `user` WHERE username ='" + data.name + "' AND password ='" + data.pass + "';", (result) => {
                        if (result.length == 1) {
                            socket.emit("login_mgs", result);
                            this.manages.addUser(new User_1.User(result[0]['id'], result[0]['username'], result[0]['gold'], result[0]['sex'], result[0]['avatar'], socket));
                        }
                        else {
                            socket.emit("login_wrong");
                        }
                    });
                }
            });
            socket.on("signup", (data) => {
                this.query("SELECT `id`FROM `user` WHERE username ='" + data.name + "'", (result) => {
                    if (result.length == 0) {
                        this.query("INSERT INTO user (username, password,sex,avatar) VALUES ('" + data.name + "', '" + data.pass + "','" + data.sex + "'," + Math.random() * 11 + ")", () => {
                            socket.emit("sign_up", true);
                        });
                    }
                    else {
                        socket.emit("sign_up", false);
                    }
                });
            });
        };
        this.onListen = () => {
            console.log('Server listening at port ' + this.port);
        };
        this.query = (query, ft) => {
            var mysql = require('mysql');
            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "oanquan"
            });
            con.connect(function (err) {
                if (err)
                    throw err;
                var sql = query;
                con.query(sql, function (err, result, field) {
                    ft(result);
                });
            });
        };
        this.app.use(express.static(__dirname + '/../dist'));
        this.server.listen(this.port, this.onListen);
        this.manages = new Manages_1.Manages();
        this.io.on('connection', this.onConnect);
    }
}
new Main();
/**
 * Created by Vu Tien Dai on 05/07/2017.
 */
//# sourceMappingURL=Main.js.map