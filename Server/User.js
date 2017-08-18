"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Administrator on 25/02/2017.
 */
class User {
    constructor(userInfo, socket) {
        this.socket = socket;
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
        this._username = userInfo;
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