/**
 * Created by Administrator on 25/02/2017.
 */
import * as express from "express";
import * as http from "http";
import * as SocketIO from "socket.io";
import Socket = SocketIO.Socket;
import {User} from "./User";
import Manager = SocketIOClient.Manager;
import {Manages} from "./Manages";
import {isNullOrUndefined} from "util";

class Main {

    app = express();
    server = http.createServer(this.app);
    io = SocketIO(this.server);
    count = 0;
    port = process.env.PORT || 3000
    manages: Manages;

    constructor() {
        this.app.use(express.static(__dirname + '/../dist'));
        this.server.listen(this.port, this.onListen);
        this.manages = new Manages();
        this.io.on('connection', this.onConnect);

    }

    onConnect = (socket: Socket) => {
        this.count++;
        socket.on("login", (data) => {
            if (!isNullOrUndefined(data)) {
                 this.query("SELECT * FROM `user` WHERE username ='" + data.name + "' AND password ='" + data.pass + "';", (result) => {
                    if (result.length == 1) {
                        socket.emit("login_mgs", result);
                        this.manages.addUser(new User(result[0]['id'], result[0]['username'], result[0]['gold'], result[0]['sex'],result[0]['avatar'], socket));
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
                    this.query("INSERT INTO user (username, password,sex,avatar) VALUES ('" + data.name + "', '" + data.pass + "','" + data.sex + "',"+Math.random()*11+")",()=>{
                        socket.emit("sign_up", true);
                    });
                }
                else {
                    socket.emit("sign_up", false);
                }
            });

        });
    }

    onListen = () => {
        console.log('Server listening at port ' + this.port);
    }

    query=(query, ft: Function)=> {
        var mysql = require('mysql');
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "oanquan"
        });
        con.connect(function (err) {
            if (err) throw err;
            var sql = query;
            con.query(sql, function(err,result,field){
                ft(result);
            })

        })
    }


}

new Main();
/**
 * Created by Vu Tien Dai on 05/07/2017.
 */
