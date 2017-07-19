/**
 * Created by Administrator on 25/02/2017.
 */
import * as express from "express";
import * as http from "http";
import * as SocketIO from "socket.io";
import Socket = SocketIO.Socket;
import {User} from "./User";

class Main {

    app = express();
    server = http.createServer(this.app);
    io = SocketIO(this.server);
    port = process.env.PORT || 3000;
    users = [];

    constructor() {

        this.app.use(express.static(__dirname + '/../dist'));;
        this.server.listen(this.port, this.onListen);
        this.io.on('connection', this.onConnect);

    }

    onConnect = (socket: Socket) => {
        // this.users.push(new User(socket));
        console.log("New User connect!");
    }

    onListen = () => {
        console.log('Server listening at port ' + this.port);
    }

}
new Main();/**
 * Created by Vu Tien Dai on 05/07/2017.
 */
