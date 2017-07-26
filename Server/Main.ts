/**
 * Created by Administrator on 25/02/2017.
 */
import * as express from "express";
import * as http from "http";
import * as SocketIO from "socket.io";
import Socket = SocketIO.Socket;
import {User} from "./User";
import {Room} from "./Room";

class Main {

    app = express();
    server = http.createServer(this.app);
    io = SocketIO(this.server);
    count = 0;
    port = process.env.PORT || 3000;
    room  : Room;
    Rooms = [];

    constructor() {
        this.app.use(express.static(__dirname + '/../dist'));
        ;
        this.server.listen(this.port, this.onListen);
        this.io.on('connection', this.onConnect);

    }

    onConnect = (socket: Socket) => {
        this.count++;
        socket.on("login", (username : string) => {
            if(this.room ==null){
                console.log("first");
                this.room = new Room(this.count, "room" + this.count);
                this.room.addUser(new User(username.toString(),socket));
            }
            else if (this.room.isFull() == true) {
                this.Rooms.push(this.room);
                this.room = new Room(this.count, "room" + this.count);
                this.room.addUser(new User(username.toString(), socket));
                console.log("Nguoi 1 zo")
            }

            else {
                this.room.addUser(new User(username.toString(),socket));
                console.log("Nguoi 2 zo")
            }
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
