"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Administrator on 25/02/2017.
 */
var User = (function () {
    function User(userInfo, socket) {
        var _this = this;
        this.socket = socket;
        this.on = function (event, fn, clear) {
            if (clear === void 0) { clear = true; }
            if (clear)
                _this.socket.removeAllListeners(event);
            _this.socket.on(event, fn);
        };
        this.emit = function (event, data) {
            if (data) {
                _this.socket.emit(event, data);
            }
            else {
                _this.socket.emit(event);
            }
        };
        this._username = userInfo;
    }
    Object.defineProperty(User.prototype, "getUserName", {
        get: function () {
            return this._username;
        },
        enumerable: true,
        configurable: true
    });
    return User;
}());
exports.User = User;
/**
 * Created by Vu Tien Dai on 05/07/2017.
 */
//# sourceMappingURL=User.js.map