"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Vu Tien Dai on 28/06/2017.
 */
var Player = (function () {
    function Player(color, username) {
        this.team_color = color;
        this.username = username;
    }
    Object.defineProperty(Player.prototype, "name", {
        get: function () {
            return this.username;
        },
        set: function (value) {
            this.username = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "turn", {
        get: function () {
            return this._turn;
        },
        set: function (value) {
            this._turn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "color", {
        get: function () {
            return this.team_color;
        },
        set: function (value) {
            this.team_color = value;
        },
        enumerable: true,
        configurable: true
    });
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=Player.js.map