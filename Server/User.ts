import Socket = SocketIO.Socket;
/**
 * Created by Administrator on 25/02/2017.
 */

export class User {
    _username: string;
    _gold: number;
    _id: number
    private _avatarID: number;
    _compatior: User;
    private _isPlaying = false;
    private _idroom: number;
    private _sex: boolean;
    socket: Socket;

    // goldsql():number {
    //     let id = this.id;
    //
    //     var mysql = require('mysql');
    //     var con = mysql.createConnection({
    //         host: "localhost",
    //         user: "root",
    //         password: "",
    //         database: "oanquan"
    //     });
    //     con.connect(function (err) {
    //         if (err) throw err;
    //         var check = "SELECT gold FROM `user` WHERE id =" + id;
    //         con.query(check, function (err, result, fields) {
    //             let gold = result[0]['gold'];
    //             return gold;
    //         })
    //
    //     })
    // }

    update_gold(gold: number, rs: string) {
        let id = this.id;
        let sc = this.socket;
        let gold1 = this._gold;
        var mysql = require('mysql');
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "oanquan"
        });
        con.connect(function (err) {
            if (err) throw err;
            var check = "UPDATE `user` SET `gold`=gold " + rs + gold + "  WHERE id=" + id;
            con.query(check, function (err, result, fields) {
                if (err)
                    throw err;
                if (rs == "+")
                    gold1 = gold1 + gold;
                else {
                    gold1 = gold1 - gold;
                }
                sc.emit("update_gold", gold1);
            })
        })
        if (rs == "+")
            this._gold = this._gold + gold;
        else {
            this._gold = this._gold - gold;
        }

    }

    setGold(gold: number) {
        this._gold = gold;
    }

    get gold(): number {
        return this._gold;
    }

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


    constructor(id: number, userInfo: string, gold: number, sex: boolean, avatar: number, socket: Socket) {
        this._sex = sex;
        this._id = id;
        this._gold = gold;
        this._username = userInfo;
        this._avatarID = avatar;
        this.socket = socket;
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

    get id(): number {
        return this._id;
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
