import Socket = SocketIO.Socket;
/**
 * Created by Administrator on 25/02/2017.
 */

export class User {
    get sex(): boolean {
        return this._sex;
    }

    set sex(value: boolean) {
        this._sex = value;
    }
    get avatarID(): number {
        return this._avatarID;
    }

    set avatarID(value: number) {
        this._avatarID = value;
    }
    get isPlaying(): boolean {
        return this._isPlaying;
    }

    set isPlaying(value: boolean) {
        this._isPlaying = value;
    }
    _username: string;
    private _avatarID:number;
    _compatior: User;
    private _isPlaying = false;
    private _idroom : number;
    private _sex:boolean;
    constructor(userInfo: any,sex :boolean, public socket: Socket) {
        this._sex = sex;
        this._username = userInfo;
        this._avatarID=Math.floor(Math.random()*14)+1;
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
