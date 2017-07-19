import Socket = SocketIO.Socket;
/**
 * Created by Administrator on 25/02/2017.
 */

export class User {
    static numUsers = 0;
    userName: string;
    connect: boolean = false;

    constructor(public socket: Socket) {
        socket.on("add user", this.onAddUser);
        socket.on("new message", this.onNewMessage);
        socket.on("disconnect", this.onUserDisconnect);
    }

    onUserDisconnect = ()=>{
        this.socket.broadcast.emit("user left", this.userName);
    }

    onAddUser = (userName: string) => {
        if (this.connect) return;
        this.userName = userName;
        this.connect = true;
        User.numUsers++;
        this.socket.broadcast.emit("user joined", {username : this.userName,message : " joined the room!"});
    }

    onNewMessage = (msg: string) => {
        this.socket.emit("new message", {
            username: this.userName,
            message: msg
        });
        this.socket.broadcast.emit("new message", {
            username: this.userName,
            message: msg
        });
    }

}/**
 * Created by Vu Tien Dai on 05/07/2017.
 */
