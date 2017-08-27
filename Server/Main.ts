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
    port = process.env.PORT || 3000;
    manages : Manages;

    constructor() {
        this.app.use(express.static(__dirname + '/../dist'));
        this.server.listen(this.port, this.onListen);
        this.io.on('connection', this.onConnect);
        this.manages = new Manages();
    }

    onConnect = (socket: Socket) => {
        this.count++;
        socket.on("login", (data) => {
            if (!isNullOrUndefined(data))
            this.manages.addUser(new User(data.name,data.sex, socket));
        });

    }

    onListen = () => {
        console.log('Server listening at port ' + this.port);
    }

}
new Main();
/**
 * Created by Vu Tien Dai on 05/07/2017.
 */
