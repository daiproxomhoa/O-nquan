"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Administrator on 25/02/2017.
 */
class User {
    constructor(id, userInfo, gold, sex, avatar, socket) {
        this._isPlaying = false;
        this.on = (event, fn, clear = true) => {
            if (clear)
                this.socket.removeAllListeners(event);
            this.socket.on(event, fn);
        };
        this.emit = (event, data) => {
            if (data) {
                this.socket.emit(event, data);
            }
            else {
                this.socket.emit(event);
            }
        };
        this._sex = sex;
        this._id = id;
        this._gold = gold;
        this._username = userInfo;
        this._avatarID = avatar;
        this.socket = socket;
    }
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
    update_gold(gold, rs) {
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
            if (err)
                throw err;
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
            });
        });
        if (rs == "+")
            this._gold = this._gold + gold;
        else {
            this._gold = this._gold - gold;
        }
    }
    setGold(gold) {
        this._gold = gold;
    }
    get gold() {
        return this._gold;
    }
    get sex() {
        return this._sex;
    }
    set sex(value) {
        this._sex = value;
    }
    get avatarID() {
        return this._avatarID;
    }
    set avatarID(value) {
        this._avatarID = value;
    }
    get isPlaying() {
        return this._isPlaying;
    }
    set isPlaying(value) {
        this._isPlaying = value;
    }
    set idroom(value) {
        this._idroom = value;
    }
    get idroom() {
        return this._idroom;
    }
    get getUserName() {
        return this._username;
    }
    get id() {
        return this._id;
    }
    setCompatior(user) {
        this._compatior = user;
    }
    getCompatior() {
        return this._compatior;
    }
}
exports.User = User;
/**
 * Created by Vu Tien Dai on 05/07/2017.
 */
//# sourceMappingURL=User.js.map