import Socket = SocketIO.Socket;
/**
 * Created by Administrator on 25/02/2017.
 */

export class User {
    _username: string;

    constructor(userInfo: any, public socket: Socket) {
        this._username = userInfo;

    }

    get getUserName(): string {
        return this._username;
    }

    on = (event: string, fn: Function, clear = true) => {
        if (clear) this.socket.removeAllListeners(event);
        this.socket.on(event, fn);
    }

    emit = (event: string, data?: any) => {
        if (data) {
            this.socket.emit(event, data);
        } else {
            this.socket.emit(event);
        }
    }
}
/**
 * Created by Vu Tien Dai on 05/07/2017.
 */
