import Socket = SocketIO.Socket;
/**
 * Created by Administrator on 25/02/2017.
 */

export class User {
    get isPlaying(): boolean {
        return this._isPlaying;
    }

    set isPlaying(value: boolean) {
        this._isPlaying = value;
    }
    _username: string;
    _compatior: User;
    private _isPlaying = false;
    private _idroom : number;
    constructor(userInfo: any, public socket: Socket) {
        this._username = userInfo;
    }

    set idroom(value: number) {
        this._idroom = value;
    }
    get idroom(): number {
        return this._idroom;
    }
    get getUserName(): string {
        return this._username;
    }

    setCompatior(user: User) {
        this._compatior = user;
    }

    getCompatior(): User {
        return this._compatior;
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
